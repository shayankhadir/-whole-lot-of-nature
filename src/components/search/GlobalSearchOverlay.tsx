"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Leaf, Loader2, Search, Tag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils/pricing";
import type { WooCommerceProduct } from "@/lib/services/woocommerceService";
import { useSearchStore } from "@/stores/searchStore";
import { useProductCategories } from "@/hooks/useProductCategories";

interface ProductsResponse {
  success: boolean;
  data: WooCommerceProduct[];
}

const MIN_QUERY_LENGTH = 2;

const sanitizeSnippet = (value?: string) => {
  if (!value) return "";
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
};

export default function GlobalSearchOverlay() {
  const { isOpen, close, open } = useSearchStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<WooCommerceProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { categories: catalogCategories } = useProductCategories();

  // Keyboard shortcut: Cmd/Ctrl + K to open search everywhere
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        open();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  // Autofocus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 10);
    } else {
      setQuery("");
      setResults([]);
      setCategoryFilter(null);
      setTagFilter(null);
      setError(null);
    }
  }, [isOpen]);

  // Debounced product search
  useEffect(() => {
    if (!isOpen) return;

    const trimmed = query.trim();
    if (trimmed.length < MIN_QUERY_LENGTH) {
      setResults([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/products?search=${encodeURIComponent(trimmed)}&limit=16`,
          { signal: controller.signal }
        );
        const json = (await response.json()) as ProductsResponse;
        if (json.success) {
          setResults(json.data);
        } else {
          setError("Unable to fetch products right now.");
          setResults([]);
        }
      } catch (err) {
        if ((err as DOMException).name === "AbortError") return;
        console.error("Search request failed", err);
        setError("Search temporarily unavailable. Please retry.");
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [query, isOpen]);

  const availableCategories = useMemo(() => {
    const seen = new Map<string, string>();
    results.forEach((product) => {
      product.categories?.forEach((cat) => {
        if (!seen.has(cat.slug)) {
          seen.set(cat.slug, cat.name);
        }
      });
    });
    return Array.from(seen, ([slug, name]) => ({ slug, name }));
  }, [results]);

  const availableTags = useMemo(() => {
    const seen = new Map<string, string>();
    results.forEach((product) => {
      product.tags?.forEach((tag) => {
        if (!seen.has(tag.slug)) {
          seen.set(tag.slug, tag.name);
        }
      });
    });
    return Array.from(seen, ([slug, name]) => ({ slug, name }));
  }, [results]);

  const filteredResults = useMemo(() => {
    return results.filter((product) => {
      const matchesCategory = categoryFilter
        ? product.categories?.some((cat) => cat.slug === categoryFilter)
        : true;
      const matchesTag = tagFilter ? product.tags?.some((tag) => tag.slug === tagFilter) : true;
      return matchesCategory && matchesTag;
    });
  }, [results, categoryFilter, tagFilter]);

  const quickCategoryPicks = useMemo(() => {
    return catalogCategories
      .filter((cat) => cat.parent === 0)
      .slice(0, 6)
      .map((cat) => ({ label: cat.name, slug: cat.slug }));
  }, [catalogCategories]);

  const handleResultClick = () => {
    close();
  };

  const renderFilters = () => (
    <div className="space-y-3">
      {availableCategories.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-widest text-white/40 mb-2">Categories</p>
          <div className="flex flex-wrap gap-2">
            {availableCategories.map((cat) => {
              const isActive = categoryFilter === cat.slug;
              return (
                <button
                  key={cat.slug}
                  onClick={() => setCategoryFilter((current) => (current === cat.slug ? null : cat.slug))}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    isActive
                      ? "border-emerald-400/60 bg-emerald-500/10 text-emerald-200"
                      : "border-white/15 text-white/90 hover:border-white/40"
                  }`}
                >
                  <Leaf className="h-3.5 w-3.5" />
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {availableTags.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-widest text-white/40 mb-2">Tags</p>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => {
              const isActive = tagFilter === tag.slug;
              return (
                <button
                  key={tag.slug}
                  onClick={() => setTagFilter((current) => (current === tag.slug ? null : tag.slug))}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    isActive
                      ? "border-emerald-400/60 bg-emerald-500/10 text-emerald-200"
                      : "border-white/15 text-white/90 hover:border-white/40"
                  }`}
                >
                  <Tag className="h-3.5 w-3.5" />
                  {tag.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  const showEmptyState = !isLoading && query.trim().length >= MIN_QUERY_LENGTH && filteredResults.length === 0;

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[120]" onClose={close}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-start justify-center px-4 py-8">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#041008] to-[#0a1c11] p-6 text-white shadow-2xl">
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <Search className="h-5 w-5 text-emerald-300" />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search plants, soil mixes, combos..."
                    className="flex-1 bg-transparent text-base text-white placeholder:text-white/60 focus:outline-none"
                  />
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <span className="hidden sm:inline">Press</span>
                    <kbd className="rounded bg-white/10 px-2 py-1 text-[10px] uppercase tracking-wide">⌘ K</kbd>
                  </div>
                  <button onClick={close} className="rounded-full p-1.5 text-white/80 hover:text-white">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {query.trim().length === 0 && quickCategoryPicks.length > 0 && (
                  <div className="mt-6">
                    <p className="text-xs uppercase tracking-[0.4em] text-white/40 mb-3">Quick picks</p>
                    <div className="flex flex-wrap gap-2">
                      {quickCategoryPicks.map((pick) => (
                        <Link
                          key={pick.slug}
                          href={`/shop?category=${pick.slug}`}
                          onClick={handleResultClick}
                          className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 hover:border-emerald-400/50 hover:text-white"
                        >
                          {pick.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {query.trim().length >= MIN_QUERY_LENGTH && (
                  <div className="mt-6 grid gap-6 md:grid-cols-[2fr_1fr]">
                    <div>
                      <div className="flex items-center justify-between text-xs uppercase tracking-widest text-white/60">
                        <span>{isLoading ? "Searching..." : `${filteredResults.length} matches`}</span>
                        {error && <span className="text-red-300 normal-case">{error}</span>}
                      </div>

                      <div className="mt-3 space-y-3 max-h-[420px] overflow-y-auto pr-2">
                        {isLoading && (
                          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-6 text-sm text-white/90">
                            <Loader2 className="h-5 w-5 animate-spin text-emerald-300" />
                            Fetching the lushest finds...
                          </div>
                        )}

                        {!isLoading && filteredResults.map((product) => (
                          <Link
                            key={product.id}
                            href={`/products/${product.slug}`}
                            onClick={handleResultClick}
                            className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 hover:border-emerald-400/40"
                          >
                            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-white/10">
                              {product.images?.[0]?.src ? (
                                <Image
                                  src={product.images[0].src}
                                  alt={product.images[0].alt || product.name}
                                  fill
                                  sizes="80px"
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-black/30 text-xs text-white/40">
                                  No image
                                </div>
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-3">
                                <p className="text-base font-semibold leading-tight text-white line-clamp-2">
                                  {product.name}
                                </p>
                                <p className="text-sm font-semibold text-emerald-200 whitespace-nowrap">
                                  {formatPrice(product.price)}
                                </p>
                              </div>
                              <p className="mt-1 text-xs text-white/80 line-clamp-2">
                                {sanitizeSnippet(product.short_description || product.description) ||
                                  "Fresh from our Bangalore greenhouse."}
                              </p>
                              <div className="mt-3 flex flex-wrap gap-2 text-[11px] uppercase tracking-wide text-white/60">
                                {product.categories?.slice(0, 3).map((cat) => (
                                  <span key={cat.id} className="rounded-full border border-white/15 px-2 py-0.5">
                                    {cat.name}
                                  </span>
                                ))}
                                {product.tags?.slice(0, 2).map((tag) => (
                                  <span key={tag.id} className="rounded-full border border-white/10 px-2 py-0.5 text-white/80">
                                    #{tag.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </Link>
                        ))}

                        {showEmptyState && (
                          <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 px-6 py-10 text-center text-white/90">
                            <p className="text-base font-semibold">No plants match that yet</p>
                            <p className="mt-2 text-sm text-white/80">
                              Try a broader phrase or explore our curated categories.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <aside className="space-y-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.4em] text-white/60">Refine</p>
                      {renderFilters()}
                      {(categoryFilter || tagFilter) && (
                        <button
                          onClick={() => {
                            setCategoryFilter(null);
                            setTagFilter(null);
                          }}
                          className="mt-3 text-xs font-semibold text-emerald-200 hover:text-white"
                        >
                          Clear filters
                        </button>
                      )}
                      <div className="rounded-xl border border-white/10 bg-black/20 p-3 text-xs text-white/80">
                        Tip: use <span className="font-semibold text-white">category filters</span> +{' '}
                        <span className="font-semibold text-white">tags</span> together for instant discovery.
                      </div>
                    </aside>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
