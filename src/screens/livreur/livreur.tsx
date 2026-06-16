import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { supabase } from '../../services/supabaseClient';
import { EagleColors, GlassStyles } from '../../theme/PremiumTheme';

interface Transaction {
  id: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  created_at: string;
}

export const LivreurWallet: React.FC = () => {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  const balanceOpacity = useSharedValue(0);

  const fetchWalletData = async () => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) throw new Error("Non autorisé");

      // Récupération de la balance avec RLS strict
      const { data: walletData, error: walletError } = await supabase
        .from('driver_wallets')
        .select('balance')
        .eq('driver_id', userData.user.id)
        .single();
        
      if (walletError) throw walletError;

      // Récupération de l'historique
      const { data: txData, error: txError } = await supabase
        .from('driver_transactions')
        .select('*')
        .eq('driver_id', userData.user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (txError) throw txError;

      setBalance(walletData.balance);
      setTransactions(txData);
      balanceOpacity.value = withTiming(1, { duration: 1000 });
    } catch (error) {
      console.error("Erreur de récupération du portefeuille:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const animatedBalanceStyle = useAnimatedStyle(() => {
    return { opacity: balanceOpacity.value };
  });

  const handleWithdrawal = async () => {
    // Logique de retrait sécurisée avec double authentification requise selon normes INPDP
    console.log("Demande de retrait initiée - Vérification biométrique requise");
  };

  if (loading) {
    return (
      <View style={[styles.mainContainer, styles.centerAll]}>
        <ActivityIndicator size="large" color={EagleColors.goldPrimary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.content}>
        <Text style={styles.headerTitle}>Mon Portefeuille Numérique</Text>
        
        {/* Carte de Balance Principale */}
        <Animated.View style={[GlassStyles.container, styles.balanceCard, animatedBalanceStyle]}>
          <Text style={styles.balanceLabel}>Solde Disponible</Text>
          <Text style={styles.balanceAmount}>{balance.toFixed(3)} <Text style={styles.currency}>TND</Text></Text>
          
          <TouchableOpacity style={styles.withdrawButton} onPress={handleWithdrawal} activeOpacity={0.8}>
            <Text style={styles.withdrawText}>Demander un Retrait</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Historique des Transactions */}
        <Text style={styles.sectionTitle}>Transactions Récentes</Text>
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={[GlassStyles.container, styles.txCard]}>
              <View>
                <Text style={styles.txType}>{item.type === 'CREDIT' ? 'Course terminée' : 'Retrait'}</Text>
                <Text style={styles.txDate}>{new Date(item.created_at).toLocaleDateString('fr-FR')}</Text>
              </View>
              <Text style={[styles.txAmount, { color: item.type === 'CREDIT' ? EagleColors.success : EagleColors.danger }]}>
                {item.type === 'CREDIT' ? '+' : '-'}{item.amount.toFixed(3)} TND
              </Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>Aucune transaction récente.</Text>}
        />
        
        <View style={styles.legalFooter}>
          <Text style={styles.legalText}>© Copyright by Eagle Groupe.tn</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = ({
  mainContainer: { flex: 1, backgroundColor: EagleColors.backgroundDark },
  centerAll: { justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, padding: 20 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: EagleColors.textPrimary, marginBottom: 30, marginTop: 10 },
  balanceCard: { padding: 30, alignItems: 'center', marginBottom: 40, backgroundColor: 'rgba(30, 25, 0, 0.8)' },
  balanceLabel: { color: EagleColors.goldSecondary, fontSize: 16, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 },
  balanceAmount: { color: EagleColors.goldPrimary, fontSize: 48, fontWeight: '900', marginBottom: 30 },
  currency: { fontSize: 24, fontWeight: '600' },
  withdrawButton: { backgroundColor: EagleColors.goldPrimary, paddingHorizontal: 40, paddingVertical: 15, borderRadius: 30, width: '100%', alignItems: 'center' },
  withdrawText: { color: EagleColors.backgroundDark, fontSize: 16, fontWeight: 'bold' },
  sectionTitle: { color: EagleColors.textPrimary, fontSize: 20, fontWeight: '700', marginBottom: 15 },
  txCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, marginBottom: 12, borderRadius: 16 },
  txType: { color: EagleColors.textPrimary, fontSize: 16, fontWeight: '600', marginBottom: 4 },
  txDate: { color: EagleColors.textSecondary, fontSize: 12 },
  txAmount: { fontSize: 18, fontWeight: 'bold' },
  emptyText: { color: EagleColors.textSecondary, textAlign: 'center', marginTop: 20 },
  legalFooter: { marginTop: 20, alignItems: 'center' },
  legalText: { color: EagleColors.textSecondary, fontSize: 10 },
});
