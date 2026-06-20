#!/bin/bash

OUTPUT_FILE="gemini_project_context.txt"
echo "--- هيكل مجلدات المشروع (PROJECT STRUCTURE) ---" > $OUTPUT_FILE

# 1. طباعة هيكل المجلدات الأساسية
if command -v tree &> /dev/null; then
    tree -I 'node_modules|.git|dist|.build' >> $OUTPUT_FILE
else
    find . -maxdepth 3 -not -path '*/.*' -not -path './node_modules*' >> $OUTPUT_FILE
fi

echo -e "\n\n--- محتوى ملفات الـ Root والـ App ---" >> $OUTPUT_FILE

# 2. البحث التلقائي عن ملفات الإعداد والتوجيه ودمجها ليفهمها الذكاء الاصطناعي
FILES_TO_FIND=(
    "src/main.jsx" "src/main.js" "src/index.js" "src/index.jsx"
    "src/App.jsx" "src/App.js" "src/App.tsx"
    "vercel.json" "vite.config.js" "package.json"
)

for file in "${FILES_TO_FIND[@]}"; do
    if [ -f "$file" ]; then
        echo -e "\n📄 FILE: $file" >> $OUTPUT_FILE
        echo "==============================" >> $OUTPUT_FILE
        cat "$file" >> $OUTPUT_FILE
        echo -e "\n==============================" >> $OUTPUT_FILE
    fi
done

echo "✅ تم تجميع كل ما تحتاجه في ملف واحد: $OUTPUT_FILE"
echo "🚀 استخدم الأمر التالي لنسخ المحتوى بالكامل لـ Gemini:"
echo "cat $OUTPUT_FILE"
