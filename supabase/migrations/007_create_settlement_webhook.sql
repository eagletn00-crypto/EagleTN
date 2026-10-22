-- ÉTAPE 1 : Activation de l'extension réseau asynchrone (Anti-blocage de transaction)
CREATE EXTENSION IF NOT EXISTS pg_net;

-- ÉTAPE 2 : Création de la fonction d'invocation sécurisée
CREATE OR REPLACE FUNCTION trigger_calculate_order_settlement()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  -- L'URL de production de votre Edge Function.
  -- À remplacer par la variable de configuration Supabase en production.
  edge_function_url TEXT := 'https://' || current_setting('app.settings.project_ref', true) || '.supabase.co/functions/v1/calculate-order-settlement';
  anon_key TEXT := current_setting('app.settings.anon_key', true);
BEGIN
  -- Invocation asynchrone sans bloquer l'UPDATE de la table orders
  PERFORM net.http_post(
    url := edge_function_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || anon_key
    ),
    body := jsonb_build_object(
      'type', TG_OP,
      'table', TG_TABLE_NAME,
      'schema', TG_TABLE_SCHEMA,
      'record', row_to_json(NEW),
      'old_record', row_to_json(OLD)
    )
  );
  
  RETURN NEW;
END;
$$;

-- ÉTAPE 3 : Déclaration du Trigger avec la condition stricte d'état
DROP TRIGGER IF EXISTS order_settlement_webhook ON public.orders;

CREATE TRIGGER order_settlement_webhook
AFTER UPDATE OF status ON public.orders
FOR EACH ROW
-- Condition d'exécution stricte : Uniquement lors de la transition vers "delivered"
WHEN (OLD.status IS DISTINCT FROM 'delivered' AND NEW.status = 'delivered')
EXECUTE FUNCTION trigger_calculate_order_settlement();
