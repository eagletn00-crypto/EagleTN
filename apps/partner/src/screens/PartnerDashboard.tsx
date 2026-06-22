import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import type { RealtimePostgresChangesPayload } from '@supabase/realtime-js'
import { GlassCard, GlassButton } from '@eagle-tn/ui'
import {
  supabase,
  getPendingOrdersByRestaurant,
  updateOrderStatus,
  getRestaurantMenu,
  updateMenuItemAvailability,
  updateMenuItemModifiers,
  getRestaurantById,
  getRestaurantStatus,
  updateRestaurantStatus,
  Order,
  MenuItem,
  MenuItemModifier,
  OrderStatus,
  RestaurantOpenStatus,
} from '@eagle-tn/database'

const RESTAURANT_ID = 1

const tabItems = [
  { id: 'orders', label: 'Commandes Live' },
  { id: 'menu-manager', label: 'Gestion du Menu' },
  { id: 'settings', label: 'Profil & Insights' },
] as const

type TabId = (typeof tabItems)[number]['id']

type RestaurantStatusOption = {
  id: RestaurantOpenStatus
  label: string
}

const statusOptions: RestaurantStatusOption[] = [
  { id: 'open', label: 'Ouvert' },
  { id: 'busy', label: 'Mode Intense' },
  { id: 'closed', label: 'Fermé' },
]

export default function PartnerDashboard() {
  const [activeTab, setActiveTab] = useState<TabId>('orders')
  const [orders, setOrders] = useState<Order[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [restaurant, setRestaurant] = useState<{
    name: string
    description: string
    address: string
    open_status: RestaurantOpenStatus
  } | null>(null)
  const [statusLoading, setStatusLoading] = useState(false)
  const [refreshingOrders, setRefreshingOrders] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [menuLoading, setMenuLoading] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<RestaurantOpenStatus>('open')

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const nextOrders = await getPendingOrdersByRestaurant(RESTAURANT_ID)
        setOrders(nextOrders)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des commandes')
      }
    }

    const handleRealtimeUpdate = (
      payload: RealtimePostgresChangesPayload<Order>
    ) => {
      if (payload.table !== 'orders') {
        return
      }

      if (payload.eventType === 'INSERT') {
        const nextOrder = payload.new
        if (nextOrder.restaurant_id !== RESTAURANT_ID) {
          return
        }
        setOrders((current) => [nextOrder, ...current])
        return
      }

      if (payload.eventType === 'UPDATE') {
        const nextOrder = payload.new
        if (nextOrder.restaurant_id !== RESTAURANT_ID) {
          return
        }

        setOrders((current) => {
          if (nextOrder.status !== 'pending') {
            return current.filter((order) => order.id !== nextOrder.id)
          }
          const existingIndex = current.findIndex((order) => order.id === nextOrder.id)
          if (existingIndex >= 0) {
            return current.map((order) => (order.id === nextOrder.id ? nextOrder : order))
          }
          return [nextOrder, ...current]
        })
        return
      }
    }

    loadOrders()

    const ordersChannel = supabase
      .channel('partner-orders')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
          filter: `restaurant_id=eq.${RESTAURANT_ID}`,
        },
        handleRealtimeUpdate
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `restaurant_id=eq.${RESTAURANT_ID}`,
        },
        handleRealtimeUpdate
      )

    void ordersChannel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        setRefreshingOrders(false)
      }
    })

    return () => {
      void supabase.removeChannel(ordersChannel)
    }
  }, [])

  useEffect(() => {
    const loadMenu = async () => {
      try {
        setMenuLoading(true)
        const data = await getRestaurantMenu(RESTAURANT_ID)
        setMenuItems(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement du menu')
      } finally {
        setMenuLoading(false)
      }
    }

    const loadRestaurant = async () => {
      try {
        const data = await getRestaurantById(RESTAURANT_ID)
        setRestaurant(data)
        setSelectedStatus(data.open_status ?? 'closed')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement du profil')
      }
    }

    loadMenu()
    loadRestaurant()
  }, [])

  const ordersTotal = useMemo(
    () => orders.reduce((sum, order) => sum + order.total_tnd, 0),
    [orders]
  )

  const handleAccept = async (orderId: number) => {
    try {
      await updateOrderStatus(orderId, 'preparing')
      setOrders((current) => current.filter((order) => order.id !== orderId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Échec de la mise à jour de la commande')
    }
  }

  const toggleAvailability = async (item: MenuItem, available: boolean) => {
    try {
      const updated = await updateMenuItemAvailability(item.id, available)
      setMenuItems((current) =>
        current.map((menuItem) => (menuItem.id === updated.id ? updated : menuItem))
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du menu')
    }
  }

  const updateModifiers = async (item: MenuItem, modifiers: MenuItemModifier[]) => {
    try {
      const updated = await updateMenuItemModifiers(item.id, modifiers)
      setMenuItems((current) =>
        current.map((menuItem) => (menuItem.id === updated.id ? updated : menuItem))
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour des modificateurs')
    }
  }

  const handleStatusChange = async (nextStatus: RestaurantOpenStatus) => {
    setStatusLoading(true)
    try {
      const updated = await updateRestaurantStatus(RESTAURANT_ID, nextStatus)
      setRestaurant((current) =>
        current ? { ...current, open_status: updated.open_status ?? nextStatus } : null
      )
      setSelectedStatus(updated.open_status ?? nextStatus)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du statut')
    } finally {
      setStatusLoading(false)
    }
  }

  const renderOrdersTab = () => (
    <div className="grid gap-6">
      <div className="grid md:grid-cols-3 gap-6">
        <GlassCard className="bg-zinc-950/90 border-amber-ultra-500/25">
          <p className="text-sm uppercase tracking-[0.24em] text-amber-ultra-500/80">Commandes en file</p>
          <p className="mt-3 text-3xl font-black text-white">{orders.length}</p>
          <p className="mt-2 text-sm text-zinc-400">Nouvelles commandes live en attente</p>
        </GlassCard>

        <GlassCard className="bg-zinc-950/90 border-amber-ultra-500/25">
          <p className="text-sm uppercase tracking-[0.24em] text-amber-ultra-500/80">Revenu projeté</p>
          <p className="mt-3 text-3xl font-black text-white">{ordersTotal.toFixed(3)} TND</p>
          <p className="mt-2 text-sm text-zinc-400">Somme brute des commandes pending</p>
        </GlassCard>

        <GlassCard className="bg-zinc-950/90 border-amber-ultra-500/25">
          <p className="text-sm uppercase tracking-[0.24em] text-amber-ultra-500/80">Live</p>
          <p className="mt-3 text-3xl font-black text-white">{refreshingOrders ? 'Refreshing…' : 'Synchro'}</p>
          <p className="mt-2 text-sm text-zinc-400">Actualisation automatique toutes les 7 secondes</p>
        </GlassCard>
      </div>

      {orders.length === 0 ? (
        <GlassCard className="bg-zinc-950/85 border-amber-ultra-500/20 text-center py-20">
          <p className="text-amber-ultra-500 font-semibold">Aucune commande pending pour le moment.</p>
          <p className="mt-2 text-zinc-400">Les nouvelles commandes apparaîtront ici dès qu'elles seront créées.</p>
        </GlassCard>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <GlassCard key={order.id} className="bg-zinc-950/85 border-amber-ultra-500/20">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-amber-ultra-500/80">Commande #{order.id}</p>
                  <p className="mt-2 text-sm text-zinc-400">Livraison: {order.delivery_address}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-lg font-bold text-white">{order.total_tnd.toFixed(3)} TND</p>
                  <GlassButton
                    onClick={() => handleAccept(order.id)}
                    className="px-4 py-2"
                  >
                    Accepter
                  </GlassButton>
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                {order.items.map((item) => (
                  <div key={`${order.id}-${item.menu_item_id}`} className="rounded-3xl border border-white/10 bg-zinc-900/80 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-white">{item.name}</p>
                        <p className="text-sm text-zinc-400">Qté: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-amber-ultra-500">{item.total_price_tnd.toFixed(3)} TND</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  )

  const renderMenuManagerTab = () => (
    <div className="grid gap-6">
      <GlassCard className="bg-zinc-950/90 border-amber-ultra-500/25">
        <p className="text-sm uppercase tracking-[0.24em] text-amber-ultra-500/80">Menu actif</p>
        <p className="mt-2 text-zinc-400">Gérez la disponibilité et les modificateurs en temps réel.</p>
      </GlassCard>

      {menuLoading ? (
        <GlassCard className="bg-zinc-950/85 border-amber-ultra-500/20 text-center py-20">
          <p className="text-amber-ultra-500 font-semibold">Chargement du menu…</p>
        </GlassCard>
      ) : (
        <div className="grid gap-4">
          {menuItems.map((item) => (
            <GlassCard key={item.id} className="bg-zinc-950/85 border-amber-ultra-500/20">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-white">{item.name}</p>
                  <p className="mt-1 text-sm text-zinc-400">{item.description}</p>
                  <p className="mt-2 text-sm text-amber-ultra-500">{item.price_tnd.toFixed(3)} TND</p>
                </div>
                <div className="flex flex-col gap-3 sm:items-end">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-zinc-400">Status</span>
                    <GlassButton
                      variant={item.available ? 'solid' : 'outline'}
                      className="px-3 py-2"
                      onClick={() => toggleAvailability(item, !item.available)}
                    >
                      {item.available ? 'Disponible' : 'Rupture'}
                    </GlassButton>
                  </div>
                  <GlassButton
                    variant="outline"
                    className="px-3 py-2"
                    onClick={() =>
                      updateModifiers(item, [
                        ...(item.modifiers ?? []),
                        {
                          id: Date.now(),
                          name: 'Option VIP',
                          price_tnd: 2.5,
                          active: true,
                        },
                      ])
                    }
                  >
                    Ajouter un modificateur
                  </GlassButton>
                </div>
              </div>
              {item.modifiers && item.modifiers.length > 0 && (
                <div className="mt-4 grid gap-2">
                  <p className="text-sm uppercase tracking-[0.24em] text-amber-ultra-500/80">Modificateurs</p>
                  {item.modifiers.map((modifier) => (
                    <div
                      key={modifier.id}
                      className="rounded-2xl border border-white/10 bg-zinc-900/80 p-3 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm text-white">{modifier.name}</p>
                        <p className="text-xs text-zinc-400">{modifier.description ?? 'Pas de description'}</p>
                      </div>
                      <p className="text-sm text-amber-ultra-500">{modifier.price_tnd.toFixed(3)} TND</p>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  )

  const renderSettingsTab = () => (
    <div className="grid gap-6">
      <div className="grid md:grid-cols-3 gap-6">
        <GlassCard className="bg-zinc-950/90 border-amber-ultra-500/25">
          <p className="text-sm uppercase tracking-[0.24em] text-amber-ultra-500/80">Statut du magasin</p>
          <p className="mt-3 text-3xl font-black text-white">{restaurant?.open_status ?? 'Fermé'}</p>
          <p className="mt-2 text-sm text-zinc-400">Mode opérationnel pour Chez Am Ali</p>
        </GlassCard>
        <GlassCard className="bg-zinc-950/90 border-amber-ultra-500/25">
          <p className="text-sm uppercase tracking-[0.24em] text-amber-ultra-500/80">Commandes attendues</p>
          <p className="mt-3 text-3xl font-black text-white">{orders.length}</p>
          <p className="mt-2 text-sm text-zinc-400">Chargement et live management</p>
        </GlassCard>
        <GlassCard className="bg-zinc-950/90 border-amber-ultra-500/25">
          <p className="text-sm uppercase tracking-[0.24em] text-amber-ultra-500/80">Revenu</p>
          <p className="mt-3 text-3xl font-black text-white">{ordersTotal.toFixed(3)} TND</p>
          <p className="mt-2 text-sm text-zinc-400">Projection sur commandes en attente</p>
        </GlassCard>
      </div>

      <GlassCard className="bg-zinc-950/85 border-amber-ultra-500/20">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-amber-ultra-500/80">Profil du restaurant</p>
            <p className="mt-2 text-2xl font-bold text-white">{restaurant?.name ?? 'Chez Am Ali'}</p>
            <p className="mt-2 text-sm text-zinc-400">{restaurant?.description ?? 'Restaurant pilote pour Eagle.tn'}</p>
          </div>
          <div className="flex flex-col gap-3 sm:items-end">
            <p className="text-sm text-zinc-400">Statut opérationnel</p>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => (
                <GlassButton
                  key={option.id}
                  variant={selectedStatus === option.id ? 'solid' : 'outline'}
                  onClick={() => handleStatusChange(option.id)}
                  className="px-4 py-2"
                >
                  {option.label}
                </GlassButton>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="bg-zinc-950/85 border-amber-ultra-500/20">
        <p className="text-sm uppercase tracking-[0.24em] text-amber-ultra-500/80">Insights financiers</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-zinc-900/80 p-6 border border-white/10">
            <p className="text-sm text-zinc-400">Total potentiel</p>
            <p className="mt-3 text-3xl font-black text-white">{ordersTotal.toFixed(3)} TND</p>
          </div>
          <div className="rounded-3xl bg-zinc-900/80 p-6 border border-white/10">
            <p className="text-sm text-zinc-400">Commandes pending</p>
            <p className="mt-3 text-3xl font-black text-white">{orders.length}</p>
          </div>
        </div>
      </GlassCard>
    </div>
  )

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="mb-8 rounded-[2rem] border border-white/10 bg-zinc-900/80 p-8 shadow-glass"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-amber-ultra-500/80">Espace Partenaire</p>
              <h1 className="mt-3 text-4xl font-black text-white">Chez Am Ali · Hub Commercial</h1>
              <p className="mt-3 max-w-2xl text-zinc-400">Gestion multi-tenant premium, commandes en direct, menu dynamique et insights financiers.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {tabItems.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-3xl px-5 py-3 text-sm font-semibold transition ${
                    activeTab === tab.id
                      ? 'bg-amber-ultra-500 text-zinc-950 shadow-amber-glow'
                      : 'border border-white/10 bg-zinc-950/70 text-white hover:bg-zinc-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200"
          >
            {error}
          </motion.div>
        )}

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === 'orders' && renderOrdersTab()}
          {activeTab === 'menu-manager' && renderMenuManagerTab()}
          {activeTab === 'settings' && renderSettingsTab()}
        </motion.div>
      </div>
    </div>
  )
}
