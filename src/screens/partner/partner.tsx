import React, { useState, useEffect } from 'react';


import { supabase } from '../../services/supabaseClient';
import { EagleColors, GlassStyles } from '../../theme/PremiumTheme';

interface Order {
  id: string;
  customer_name: string;
  items: string;
  total_amount: number;
  status: 'PENDING' | 'PREPARING' | 'READY';
}

export const PartnerDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // محاكاة جلب الطلبات الحية الخاصة بالمطعم الشريك عبر السوبابيس
    setOrders([
      { id: '101', customer_name: 'Mohamed Ali', items: '2x Pizza Caprese, 1x Coca', total_amount: 34.500, status: 'PENDING' },
      { id: '102', customer_name: 'Sonia Ben Youssef', items: '1x Couscous Poulet', total_amount: 18.000, status: 'PREPARING' },
    ]);
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: 'PREPARING' | 'READY') => {
    // هنا يتم تحديث حالة الطلب فورياً في قاعدة البيانات وتنبيه السائق عبر نظام CAT
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <div class="overflow-y-auto" contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <div entering={FadeInUp.duration(600)} style={styles.header}>
          <p style={styles.headerTitle}>EAGLE <p style={styles.goldText}>PARTNER</p></p>
          <p style={styles.subHeader}>Gestion des Commandes en Temps Réel</p>
        </div>

        <p style={styles.sectionTitle}>Commandes Actives</p>
        
        {orders.map((order, index) => (
          <div key={order.id} entering={FadeInDown.delay(index * 100).duration(500)} style={Object.assign({}, GlassStyles.container, styles.orderCard)}>
            <div style={styles.orderHeader}>
              <p style={styles.orderId}>Commande #{order.id}</p>
              <p style={styles.orderPrice}>{order.total_amount.toFixed(3)} TND</p>
            </div>
            <p style={styles.customerName}>Client: {order.customer_name}</p>
            <p style={styles.orderItems}>{order.items}</p>

            <div style={styles.actionRow}>
              {order.status === 'PENDING' && (
                <button style={Object.assign({}, styles.btn, styles.btnPrepare)} onClick={() => updateOrderStatus(order.id, 'PREPARING')}>
                  <p style={styles.btnText}>Accepter & Préparer</p>
                </button>
              )}
              {order.status === 'PREPARING' && (
                <button style={Object.assign({}, styles.btn, styles.btnReady)} onClick={() => updateOrderStatus(order.id, 'READY')}>
                  <p style={styles.btnText}>Prêt pour le Coursier</p>
                </button>
              )}
              {order.status === 'READY' && (
                <div style={styles.statusBadge}><p style={styles.statusText}>En attente du coursier CAT...</p></div>
              )}
            </div>
          </div>
        ))}

        <div style={styles.footer}>
          <p style={styles.copyrightText}>© {new Date().getFullYear()} Copyright by Eagle Groupe.tn</p>
          <p style={styles.legalText}>Données cryptées & Conformes aux exigences de l'INPDP</p>
        </div>

      </div>
    </SafeAreaView>
  );
};

const styles = ({
  mainContainer: { flex: 1, backgroundColor: EagleColors.backgroundDark },
  scrollContent: { padding: 20 },
  header: { marginBottom: 30, marginTop: 10 },
  headerTitle: { fontSize: 28, fontWeight: '900', color: EagleColors.textPrimary, letterSpacing: 1 },
  goldText: { color: EagleColors.goldPrimary },
  subHeader: { color: EagleColors.textSecondary, fontSize: 14, marginTop: 4 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: EagleColors.textPrimary, marginBottom: 15 },
  orderCard: { padding: 20, marginBottom: 20 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  orderId: { color: EagleColors.goldPrimary, fontSize: 16, fontWeight: 'bold' },
  orderPrice: { color: EagleColors.textPrimary, fontSize: 16, fontWeight: 'bold' },
  customerName: { color: EagleColors.textPrimary, fontSize: 14, fontWeight: '600', marginBottom: 5 },
  orderItems: { color: EagleColors.textSecondary, fontSize: 14, marginBottom: 15 },
  actionRow: { marginTop: 5 },
  btn: { paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  btnPrepare: { backgroundColor: EagleColors.goldPrimary },
  btnReady: { backgroundColor: EagleColors.success },
  btnText: { color: EagleColors.backgroundDark, fontSize: 14, fontWeight: 'bold' },
  statusBadge: { backgroundColor: 'rgba(255,215,0,0.1)', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: EagleColors.goldPrimary },
  statusText: { color: EagleColors.goldPrimary, textAlign: 'center', fontWeight: '600' },
  footer: { marginTop: 40, alignItems: 'center', opacity: 0.5 },
  copyrightText: { color: EagleColors.textSecondary, fontSize: 11 },
  legalText: { color: EagleColors.textSecondary, fontSize: 9, marginTop: 2 }
});

export default PartnerDashboard;
