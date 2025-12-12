import fs from 'fs';
import path from 'path';

type RouteKind = 'page' | 'api';

type RouteEntry = {
  path: string;
  kind: RouteKind;
  source: string;
};

type LinkOccurrence = {
  href: string;
  source: string;
  line: number;
};

function toPosix(p: string) {
  return p.split(path.sep).join('/');
}

function stripQueryHash(href: string) {
  const q = href.indexOf('?');
  const h = href.indexOf('#');
  const cut = q === -1 ? h : h === -1 ? q : Math.min(q, h);
  const raw = cut === -1 ? href : href.slice(0, cut);
  if (raw.length > 1 && raw.endsWith('/')) return raw.slice(0, -1);
  return raw;
}

function isGroupSegment(seg: string) {
  return seg.startsWith('(') && seg.endsWith(')');
}

function routeFromAppPath(relDir: string) {
  // relDir like "shop/[slug]"
  const segments = relDir.split('/').filter(Boolean).filter((s) => !isGroupSegment(s));
  const route = '/' + segments.join('/');
  return route === '/page' ? '/' : route;
}

function specialFileRoute(fileName: string) {
  if (fileName === 'sitemap.ts' || fileName === 'sitemap.js') return '/sitemap.xml';
  if (fileName === 'robots.ts' || fileName === 'robots.js') return '/robots.txt';
  return null;
}

function walkFiles(rootDir: string, exts: Set<string>) {
  const out: string[] = [];
  const stack = [rootDir];
  while (stack.length) {
    const dir = stack.pop()!;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name === 'node_modules' || e.name === '.next' || e.name === '.git') continue;
        stack.push(full);
      } else if (e.isFile()) {
        const ext = path.extname(e.name).toLowerCase();
        if (exts.has(ext)) out.push(full);
      }
    }
  }
  return out;
}

function collectPublicStaticPaths(publicDir: string, repoRoot: string) {
  if (!fs.existsSync(publicDir)) return new Set<string>();

  // Keep this intentionally narrow: we only treat document-like assets as valid internal href targets.
  const staticExts = new Set([
    '.txt',
    '.xml',
    '.md',
    '.pdf',
    '.json',
    '.png',
    '.jpg',
    '.jpeg',
    '.webp',
    '.svg',
  ]);
  const files = walkFiles(publicDir, staticExts);

  const out = new Set<string>();
  for (const filePath of files) {
    const rel = toPosix(path.relative(publicDir, filePath));
    out.add('/' + rel);
  }
  return out;
}

function collectRoutes(appDir: string, repoRoot: string): RouteEntry[] {
  const routes: RouteEntry[] = [];

  // page + api routes
  const routeFiles = walkFiles(appDir, new Set(['.ts', '.tsx', '.js', '.jsx']));

  for (const filePath of routeFiles) {
    const base = path.basename(filePath);

    const special = specialFileRoute(base);
    if (special) {
      routes.push({
        path: special,
        kind: 'page',
        source: toPosix(path.relative(repoRoot, filePath)),
      });
      continue;
    }

    if (base !== 'page.tsx' && base !== 'page.ts' && base !== 'route.ts' && base !== 'route.js') {
      continue;
    }

    const rel = toPosix(path.relative(appDir, path.dirname(filePath)));
    const route = routeFromAppPath(rel);

    if (base.startsWith('route.')) {
      routes.push({ path: route.startsWith('/api') ? route : `/api${route === '/' ? '' : route}`, kind: 'api', source: toPosix(path.relative(repoRoot, filePath)) });
    } else {
      routes.push({ path: route, kind: 'page', source: toPosix(path.relative(repoRoot, filePath)) });
    }
  }

  // Normalize, unique
  const seen = new Set<string>();
  const unique: RouteEntry[] = [];
  for (const r of routes) {
    const key = `${r.kind}:${r.path}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(r);
  }

  unique.sort((a, b) => (a.path + a.kind).localeCompare(b.path + b.kind));
  return unique;
}

function computeLineNumber(text: string, index: number) {
  // 1-based
  let line = 1;
  for (let i = 0; i < index; i++) {
    if (text.charCodeAt(i) === 10) line++;
  }
  return line;
}

function collectInternalLinks(srcDir: string, repoRoot: string): LinkOccurrence[] {
  const files = walkFiles(srcDir, new Set(['.ts', '.tsx', '.js', '.jsx']));
  const occurrences: LinkOccurrence[] = [];

  const patterns: Array<{ kind: string; re: RegExp; group: number }> = [
    { kind: 'href', re: /\bhref\s*=\s*(?:\{\s*)?['"]([^'"]+)['"]/g, group: 1 },
    { kind: 'path', re: /\bpath\s*:\s*['"]([^'"]+)['"]/g, group: 1 },
    { kind: 'redirect', re: /\b(permanentRedirect|redirect)\s*\(\s*['"]([^'"]+)['"]/g, group: 2 },
    { kind: 'router', re: /\b(push|replace)\s*\(\s*['"]([^'"]+)['"]/g, group: 2 },
  ];

  for (const filePath of files) {
    const text = fs.readFileSync(filePath, 'utf8');
    for (const p of patterns) {
      p.re.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = p.re.exec(text))) {
        const rawHref = (m[p.group] || '').trim();
        if (!rawHref.startsWith('/')) continue;
        const normalized = stripQueryHash(rawHref);
        // skip obvious non-app internal destinations
        if (normalized.startsWith('/wp-admin') || normalized.startsWith('/wp-json')) continue;

        occurrences.push({
          href: normalized,
          source: toPosix(path.relative(repoRoot, filePath)),
          line: computeLineNumber(text, m.index),
        });
      }
    }
  }

  return occurrences;
}

function routePatternToRegex(routePattern: string) {
  const segments = routePattern.split('/').filter(Boolean);
  let re = '^';
  if (segments.length === 0) return /^\/$/;
  for (const seg of segments) {
    if (seg.startsWith('[[...') && seg.endsWith(']]')) {
      // optional catch-all
      re += '(?:/.*)?';
      continue;
    }
    if (seg.startsWith('[...') && seg.endsWith(']')) {
      re += '/.+?';
      continue;
    }
    if (seg.startsWith('[') && seg.endsWith(']')) {
      re += '/[^/]+';
      continue;
    }
    re += '/' + seg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  re += '$';
  return new RegExp(re);
}

function main() {
  const repoRoot = process.cwd();
  const appDir = path.join(repoRoot, 'src', 'app');
  const srcDir = path.join(repoRoot, 'src');
  const publicDir = path.join(repoRoot, 'public');

  const routes = collectRoutes(appDir, repoRoot);
  const links = collectInternalLinks(srcDir, repoRoot);
  const publicStaticPaths = collectPublicStaticPaths(publicDir, repoRoot);

  const routeRegexes = routes.map((r) => ({ ...r, re: routePatternToRegex(r.path) }));

  const broken: LinkOccurrence[] = [];
  for (const occ of links) {
    const okRoute = routeRegexes.some((r) => r.re.test(occ.href));
    const okStatic = publicStaticPaths.has(occ.href);
    if (!okRoute && !okStatic) broken.push(occ);
  }

  const referenced = new Set(links.map((l) => l.href));
  const pageRoutes = routes.filter((r) => r.kind === 'page');

  const orphan = pageRoutes
    .filter((r) => {
      // ignore system routes
      if (r.path === '/_not-found') return false;
      return !referenced.has(r.path);
    })
    .map((r) => ({ path: r.path, source: r.source }));

  const audit = {
    generatedAt: new Date().toISOString(),
    counts: {
      totalRoutes: routes.length,
      pageRoutes: routes.filter((r) => r.kind === 'page').length,
      apiRoutes: routes.filter((r) => r.kind === 'api').length,
      internalLinks: links.length,
      brokenLinks: broken.length,
      orphanRoutes: orphan.length,
    },
    routes,
    brokenLinks: broken.map((b) => ({ href: b.href, source: b.source, line: b.line })),
    orphanRoutes: orphan,
  };

  const outPath = path.join(repoRoot, 'src', 'data', 'siteAudit.generated.ts');
  const content = `export type SiteAudit = ${JSON.stringify(undefined)};\n`;
  // We write a TS module with a stable type + value to avoid JSON import config.
  const file = `export type SiteAudit = {\n  generatedAt: string;\n  counts: {\n    totalRoutes: number;\n    pageRoutes: number;\n    apiRoutes: number;\n    internalLinks: number;\n    brokenLinks: number;\n    orphanRoutes: number;\n  };\n  routes: Array<{ path: string; kind: 'page' | 'api'; source: string }>;\n  brokenLinks: Array<{ href: string; source: string; line: number }>;\n  orphanRoutes: Array<{ path: string; source: string }>;\n};\n\nexport const siteAudit: SiteAudit = ${JSON.stringify(audit, null, 2)} as const;\n`;

  fs.writeFileSync(outPath, file, 'utf8');

  // Also emit a human-readable report
  const reportPath = path.join(repoRoot, 'SITE_AUDIT_REPORT.md');
  const report = [
    `# Site Audit Report`,
    ``,
    `Generated: ${audit.generatedAt}`,
    ``,
    `## Summary`,
    `- Total routes: ${audit.counts.totalRoutes}`,
    `- Page routes: ${audit.counts.pageRoutes}`,
    `- API routes: ${audit.counts.apiRoutes}`,
    `- Internal links found: ${audit.counts.internalLinks}`,
    `- Broken internal links: ${audit.counts.brokenLinks}`,
    `- Orphan page routes (unreferenced in source): ${audit.counts.orphanRoutes}`,
    ``,
    `## Broken Internal Links`,
    audit.brokenLinks.length
      ? audit.brokenLinks.map((b) => `- ${b.href} (at ${b.source}:${b.line})`).join('\n')
      : `- None`,
    ``,
    `## Orphan Page Routes`,
    orphan.length ? orphan.map((o) => `- ${o.path} (${o.source})`).join('\n') : `- None`,
    ``,
  ].join('\n');

  fs.writeFileSync(reportPath, report, 'utf8');

  console.log('Site audit generated:', toPosix(path.relative(repoRoot, outPath)));
  console.log('Report written:', toPosix(path.relative(repoRoot, reportPath)));
  console.log('Broken links:', audit.counts.brokenLinks);
}

main();
