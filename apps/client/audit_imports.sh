#!/bin/bash
if [ -f "src/main.tsx" ]; then
    echo "main.tsx: OK"
else
    echo "main.tsx: MISSING"
fi

if [ -f "src/App.tsx" ]; then
    echo "App.tsx: OK"
else
    echo "App.tsx: MISSING"
fi

find src -type f \( -name "*.ts" -o -name "*.tsx" \) | while read -r file; do
    grep -E "import.*from.*'\..*'" "$file" | while read -r line; do
        imported_path=$(echo "$line" | sed -E "s/.*from\s+['\"](.*)['\"].*/\1/")
        file_dir=$(dirname "$file")
        resolved_path=$(realpath -m "$file_dir/$imported_path")
        exists=false
        for ext in "" ".tsx" ".ts" "/index.tsx" "/index.ts"; do
            if [ -f "${resolved_path}${ext}" ] || [ -d "${resolved_path}" ]; then
                exists=true
                break
            fi
        done
        if [ "$exists" = false ]; then
            echo "BROKEN: $file"
            echo "       $imported_path"
            echo "       $resolved_path"
        fi
    done
done

find src -type d | while read -r dir; do
    if [ -f "${dir}.tsx" ]; then
        echo "CONFLICT: $dir & ${dir}.tsx"
    fi
done
