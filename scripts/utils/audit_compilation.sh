#!/bin/bash
# Pipeline d'audit d'intégrité EAGLE TN pour Termux

echo "==================================================="
echo "[EAGLE TN] DÉMARRAGE DE L'AUDIT DE STABILITÉ"
echo "==================================================="

# 1. Vérification stricte du Frontend (React/Vite/TS)
echo "-> [1/2] Analyse de l'arbre syntaxique Frontend (apps/partner)..."
cd apps/partner || exit
pnpm tsc --noEmit
if [ $? -eq 0 ]; then
    echo "✅ [SUCCÈS] Frontend : Aucune erreur TypeScript TS2322/TS2613 détectée."
else
    echo "❌ [ÉCHEC] Frontend : Erreurs de typage identifiées. Arrêt du pipeline."
    exit 1
fi
cd ../../

# 2. Vérification de l'Edge Function (Deno)
echo "-> [2/2] Validation de la syntaxe Deno de l'Edge Function..."
# Utilisation de la CLI Supabase pour vérifier l'environnement Deno sans polluer Node
npx supabase functions serve calculate-order-settlement --no-verify-jwt &
SERVE_PID=$!

# Attente de la montée en charge du serveur local
sleep 4

# Ping de vérification (Requête OPTIONS pour tester les CORS et le routing)
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X OPTIONS http://localhost:54321/functions/v1/calculate-order-settlement)

if [ "$HTTP_STATUS" -eq 200 ]; then
    echo "✅ [SUCCÈS] Backend : Edge Function compilée et répond aux requêtes pré-vol."
else
    echo "❌ [ÉCHEC] Backend : L'Edge Function a échoué au démarrage (Code: $HTTP_STATUS)."
fi

# Nettoyage du processus en arrière-plan
kill $SERVE_PID

echo "==================================================="
echo "AUDIT TERMINÉ. PRÊT POUR : npx supabase functions deploy calculate-order-settlement"
echo "==================================================="
