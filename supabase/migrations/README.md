# Supabase Migrations - Phase 2 Enterprise Audit

## Overview

This directory contains the complete SQL migrations for Phase 2 of the Enterprise Audit implementation. These migrations transform the database from a basic schema into a fully role-based, multi-tenant, secure order management system supporting 4 user roles: Client, Partner, Driver, and Admin.

## Migration Order

Migrations MUST be executed in order:

1. **001_create_profiles_table.sql** - User roles and identity
2. **002_create_deliveries_table.sql** - Driver assignment and tracking
3. **003_create_update_order_status_rpc.sql** - Secure status transition RPC
4. **004_enhance_rls_policies.sql** - Advanced row-level security

## Deployment Instructions

### Option 1: Supabase Dashboard (Recommended for small teams)

1. Log in to [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to your project's SQL Editor
3. Create a new query for each migration file
4. Copy the entire migration content
5. Click **Run** and verify success
6. Repeat for each migration in order

### Option 2: Supabase CLI (Recommended for teams)

```bash
# Install Supabase CLI if not already installed
npm install -g supabase@latest

# Link to your project
supabase link --project-id <your-project-id>

# Apply all migrations
supabase db push

# Verify migrations
supabase db lint
```

### Option 3: Direct PostgreSQL Connection

If you have direct database access:

```bash
# Using psql
psql postgresql://user:password@db.host.com:5432/postgres -f 001_create_profiles_table.sql
psql postgresql://user:password@db.host.com:5432/postgres -f 002_create_deliveries_table.sql
psql postgresql://user:password@db.host.com:5432/postgres -f 003_create_update_order_status_rpc.sql
psql postgresql://user:password@db.host.com:5432/postgres -f 004_enhance_rls_policies.sql
```

## What Each Migration Does

### 001_create_profiles_table.sql

**Purpose:** Establishes user identity and role-based access control

**Tables Created:**
- `profiles` - User profiles linked to auth.users

**Types Created:**
- `user_role` ENUM: `client`, `partner`, `driver`, `admin`

**Key Features:**
- Auto-creates profile on user signup
- Prevents role escalation via RLS
- Indexes on role and email for fast lookups
- Timestamps for audit trail

**Dependencies:** None (requires auth.users from Supabase Auth)

### 002_create_deliveries_table.sql

**Purpose:** Tracks delivery assignments and real-time driver progress

**Tables Created:**
- `deliveries` - Delivery tracking with driver assignment

**Types Created:**
- `delivery_status` ENUM: Tracks delivery progression

**Key Features:**
- Bridges orders to drivers
- Real-time location tracking (lat/lng)
- Automatic syncing of delivery status to order status via trigger
- Comprehensive state validation

**Dependencies:** Requires `orders` and `profiles` tables

### 003_create_update_order_status_rpc.sql

**Purpose:** Secure, validated order status transitions

**Functions Created:**
- `update_order_status()` - RPC for all status changes

**Key Features:**
- Role-based authorization (only certain roles can make certain transitions)
- Valid transition enforcement (prevents impossible states)
- Automatic audit trail creation
- Atomic transactions
- Comprehensive error responses

**Dependencies:** Requires `profiles`, `orders`, `order_status_history` tables

### 004_enhance_rls_policies.sql

**Purpose:** Implement 4-party row-level security

**Policies Created:**
- Orders: Client, Partner, Driver, Admin access control
- Order Items: Inheritance from parent order + modification prevention
- Status History: Audit trail access control
- Deliveries: Driver tracking isolation

**Functions Created:**
- `get_order_for_driver()` - Fetch orders with masked customer data

**Key Features:**
- Strict role isolation
- Privacy masking for drivers (phone numbers hidden unless assigned)
- Realtime subscriptions enabled
- Trigger-based audit logging

**Dependencies:** Requires all previous migrations

## Testing After Deployment

### 1. Verify Tables Exist

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Expected tables:
- `auth.users`
- `profiles`
- `orders`
- `order_items`
- `deliveries`
- `order_status_history`

### 2. Test Role Creation

```sql
-- Insert a test admin
INSERT INTO profiles (id, email, full_name, role)
VALUES (
  auth.users.id,
  'admin@test.com',
  'Test Admin',
  'admin'
)
WHERE email = 'admin@test.com';

-- Verify
SELECT * FROM profiles WHERE role = 'admin';
```

### 3. Test RLS Policies

Create test users and verify they can only see appropriate data:

```sql
-- As authenticated user (client)
SELECT * FROM orders;  -- Should only show own orders

-- Try to select orders they don't own (should fail or return empty)
SELECT * FROM orders WHERE client_id != auth.uid();
```

### 4. Test RPC Function

```sql
-- Call update_order_status RPC
SELECT update_order_status(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  'accepted'::order_status,
  'Test acceptance'
);

-- Verify response
-- Should return: {success: true, order_id: "...", status: "accepted", ...}
```

### 5. Test Realtime Subscriptions

From your frontend (e.g., Livreur app):

```typescript
import { supabase } from '@eagle/database';

const channel = supabase
  .channel('order-updates')
  .on('postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'orders',
    },
    (payload) => console.log('Order updated:', payload)
  )
  .subscribe();

// When you update an order, you should see the change in console
```

## Rollback Instructions

If you need to rollback migrations:

```sql
-- Rollback 004 (drop policies)
-- Note: PostgreSQL doesn't automatically drop policies, so this is manual

-- Rollback 003 (drop RPC)
DROP FUNCTION IF EXISTS update_order_status(uuid, order_status, text);

-- Rollback 002 (drop deliveries table)
DROP TABLE IF EXISTS deliveries CASCADE;

-- Rollback 001 (drop profiles table)
DROP TABLE IF EXISTS profiles CASCADE;
DROP TYPE IF EXISTS user_role;
```

**WARNING:** Rollback will DELETE all data in these tables. Always backup first!

## Troubleshooting

### "permission denied for schema public"

**Solution:** Ensure your Supabase account has service role access. Use `supabase` or `service_role` key.

### "relation auth.users does not exist"

**Solution:** Ensure Supabase Auth is enabled in your project (it should be by default).

### RLS policy preventing all reads

**Solution:** Check RLS policies are correct. You can temporarily disable for testing:

```sql
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
-- ... test ...
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

### Realtime not working

**Solution:** Ensure you've run `ALTER TABLE ... REPLICA IDENTITY FULL;` and enabled Realtime in Supabase Dashboard:

1. Go to Realtime > Replication
2. Check that `orders`, `order_status_history`, `deliveries` are enabled

## Performance Tuning

After deployment, verify indexes are being used:

```sql
-- Check index usage
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
```

Add additional indexes if needed:

```sql
-- Add composite index for driver lookups
CREATE INDEX idx_deliveries_driver_status_created
ON deliveries(driver_id, status, created_at DESC);

-- Add index for order filtering by date
CREATE INDEX idx_orders_created_at_status
ON orders(created_at DESC, status);
```

## Next Steps

After all migrations are deployed:

1. **Update Frontend Services:**
   - Import canonical types from `@eagle/database`
   - Use new `OrderService` for all order operations
   - Test checkout flow with RPC

2. **Driver App Updates:**
   - Use `update_order_status` RPC for status changes
   - Subscribe to realtime `deliveries` table
   - Implement privacy masking for customer data

3. **Partner Portal Updates:**
   - Query orders via RLS-secured endpoint
   - Use `update_order_status` RPC for order management

4. **Admin Dashboard:**
   - Set up role as admin in profiles table
   - Test full platform visibility

5. **Monitoring:**
   - Set up database monitoring for slow queries
   - Track RLS policy performance
   - Monitor realtime subscription concurrency

## Support

For issues or questions:

1. Check Supabase documentation: https://supabase.com/docs
2. Review PostgreSQL docs for RLS: https://www.postgresql.org/docs/current/ddl-rowsecurity.html
3. Check Supabase community Discord

## Changelog

### Phase 2 Complete

- ✅ Canonical order status enum unified across all 4 apps
- ✅ RPC-first OrderService (zero direct inserts)
- ✅ Multi-role profiles table with auto-creation
- ✅ Delivery tracking with driver assignment
- ✅ Secure update_order_status RPC with role validation
- ✅ Comprehensive RLS policies for 4-party ecosystem
- ✅ Privacy masking for sensitive data
- ✅ Audit trail via order_status_history
- ✅ Realtime subscriptions for all parties
