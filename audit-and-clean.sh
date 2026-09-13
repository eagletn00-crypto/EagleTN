#!/usr/bin/env bash

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}====================================================${NC}"
echo -e "${BLUE}   🚀 pnpm Monorepo Sync & Cleanup - The-Eagletn    ${NC}"
echo -e "${BLUE}====================================================${NC}"

cd "$HOME/The-Eagletn"

# 1. تجهيز حزمة @eagletn/types
mkdir -p packages/types/src

cat << 'JSON' > packages/types/package.json
{
  "name": "@eagletn/types",
  "version": "1.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts"
}
JSON

# 2. إنشاء ملف Types موحد
cat << 'TS' > packages/types/src/index.ts
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      menu_items: {
        Row: {
          id: string
          restaurant_id: string
          name_fr: string
          name_ar: string
          desc_fr: string
          desc_ar: string
          price: number
          category: string
          image_url: string
          is_available: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['menu_items']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['menu_items']['Insert']>
      }
      users_consent_logs: {
        Row: {
          id: string
          user_id: string
          inpdp_consent_given: boolean
          ip_address: string
          consent_date: string
        }
      }
    }
  }
}
TS

echo -e "${GREEN}✓ تم إنشاء حزمة @eagletn/types النظيفة بنجاح.${NC}"

# 3. تنظيف مخلفات pnpm و Vite
echo -e "\n${YELLOW}[pnpm] تنظيف المجلدات المؤقتة (.vite / dist / node_modules/.cache)...${NC}"
pnpm -r exec rm -rf .vite dist .cache 2>/dev/null || true

# 4. إعادة المزامنة والتثبيت عبر pnpm
echo -e "\n${YELLOW}[pnpm] مزامنة اعتمادات الـ Workspace...${NC}"
pnpm install

echo -e "\n${GREEN}====================================================${NC}"
echo -e "${GREEN}   ✨ اكتملت المزامنة بنجاح عبر pnpm!              ${NC}"
echo -e "${GREEN}====================================================${NC}"
