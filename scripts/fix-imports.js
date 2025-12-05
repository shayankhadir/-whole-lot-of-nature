
const fs = require('fs');
const path = require('path');

const files = [
    "src/components/ui/AnimatedBackground.tsx",
    "src/components/ui/AnimatedText.tsx",
    "src/components/ui/BackgroundEffects.tsx",
    "src/components/ui/FloatingDock.tsx",
    "src/components/ui/GlassCard.tsx",
    "src/components/ui/hover-border-gradient.tsx",
    "src/components/ui/LeafBackground.tsx",
    "src/components/ui/LeafDecoration.tsx",
    "src/components/ui/lens-demo.tsx",
    "src/components/ui/lens.tsx",
    "src/components/ui/NewsletterPopup.tsx",
    "src/components/ui/PlantProgress.tsx",
    "src/components/ui/ProductCard.tsx",
    "src/components/ui/SeamlessSection.tsx",
    "src/components/ui/ServiceCard.tsx",
    "src/components/ui/SpotlightCard.tsx",
    "src/components/ui/TestimonialCard.tsx",
    "src/components/ui/TopBanner.tsx",
    "src/components/ui/TropicalBackground.tsx"
];

files.forEach(file => {
    const filePath = path.resolve(process.cwd(), file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf-8');
        
        // Check if motion is used
        if (content.includes('<motion.') || content.includes('motion.')) {
            // Check if framer-motion is imported
            if (!content.includes('from "framer-motion"') && !content.includes("from 'framer-motion'")) {
                console.log(`Adding framer-motion import to ${file}`);
                
                // Insert after 'use client' if present, otherwise at top
                if (content.startsWith("'use client';")) {
                    content = content.replace("'use client';", "'use client';\nimport { motion } from 'framer-motion';");
                } else if (content.startsWith('"use client";')) {
                    content = content.replace('"use client";', '"use client";\nimport { motion } from "framer-motion";');
                } else {
                    content = "import { motion } from 'framer-motion';\n" + content;
                }
                
                fs.writeFileSync(filePath, content, 'utf-8');
            } else {
                console.log(`${file} already has framer-motion import`);
            }
        } else {
            console.log(`${file} does not use motion components`);
        }
    } else {
        console.log(`File not found: ${file}`);
    }
});
