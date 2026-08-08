#!/bin/bash
echo "🔍 === جاري فحص بنية مشروع The-Eagletn ==="
echo ""

echo "📂 1. المجلدات والملفات الرئيسية المكونة للمشروع:"
find . -maxdepth 3 -not -path '*/.*' -not -path '*/node_modules*' -not -path '*/dist*'

echo ""
echo "📦 2. فحص حالة حزم pnpm والحجم الإجمالي:"
du -sh node_modules/ 2>/dev/null || echo "node_modules غير موجودة في المجلد الرئيسي"
du -sh apps/* 2>/dev/null

echo ""
echo "🧹 3. البحث عن الملفات المؤقتة والزائدة (Clean Candidate):"
find . -type f \( -name "*.log" -o -name "*.tmp" -o -name ".DS_Store" -o -name "tsconfig.tsbuildinfo" \) -not -path "*/node_modules/*"

