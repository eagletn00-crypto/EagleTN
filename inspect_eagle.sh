#!/bin/bash
OUTPUT="eagle_inspection_report.txt"

echo "=== 1. SYSTEM & MONOREPO OVERVIEW ===" > $OUTPUT
cat package.json >> $OUTPUT
echo -e "\n--- PNPM WORKSPACE ---" >> $OUTPUT
cat pnpm-workspace.yaml 2>/dev/null >> $OUTPUT

echo -e "\n=== 2. PACKAGES ARCHITECTURE ===" >> $OUTPUT
find packages -maxdepth 3 -not -path '*/node_modules*' | sort >> $OUTPUT

echo -e "\n=== 3. CLIENT APP & CAPACITOR CONFIG ===" >> $OUTPUT
cat apps/client/package.json >> $OUTPUT
echo -e "\n--- CAPACITOR CONFIG ---" >> $OUTPUT
cat apps/client/capacitor.config.ts 2>/dev/null >> $OUTPUT

echo -e "\n=== 4. DESIGN SYSTEM & TAILWIND V4 TOKENS ===" >> $OUTPUT
cat apps/client/src/index.css 2>/dev/null >> $OUTPUT

echo -e "\n=== 5. DATABASE & TYPES (SUPABASE / SCHEMA) ===" >> $OUTPUT
find . -maxdepth 4 \( -name "*schema*" -o -name "*types*" -o -name "*supabase*" \) -not -path '*/node_modules*' | sort >> $OUTPUT

echo "Inspection Report Generated: $OUTPUT"
