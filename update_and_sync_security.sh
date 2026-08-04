#!/bin/bash
# Micro-service totalement silencieux.
export VITE_SUPABASE_URL=$(grep VITE_SUPABASE_URL .env | cut -d '=' -f2)
export VITE_SUPABASE_ANON_KEY=$(grep VITE_SUPABASE_ANON_KEY .env | cut -d '=' -f2)
