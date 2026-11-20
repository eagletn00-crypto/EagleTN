#!/bin/bash
echo "=== PNPM WORKSPACE CONFIG ==="
cat pnpm-workspace.yaml 2>/dev/null || echo "[!] No pnpm-workspace.yaml found"

echo -e "\n=== ROOT PACKAGE.JSON (DEPS & SCRIPTS) ==="
cat package.json 2>/dev/null | grep -E '"(scripts|dependencies|devDependencies|workspaces)"' -A 20

echo -e "\n=== MONOREPO STRUCTURE ==="
find . -maxdepth 3 -type d \( -name node_modules -o -name .git -o -name dist -o -name build -o -name .turbo \) -prune -o -print

echo -e "\n=== TAILWIND & VITE CHECK (APPS LEVEL) ==="
find apps -maxdepth 2 -type f \( -name "vite.config.ts" -o -name "tailwind.config.*" -o -name "*.css" \) 2>/dev/null
