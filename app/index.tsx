import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, StatusBar, TextInput, Button } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; 
import LivePrice from '../LivePrice';
import TradingViewChart from '../TradingViewChart';
import { getBtcBalance, getUsdtBalance, tradeMarketOrder } from '../TradeBot';

export default function App() {
  const [buyAmount, setBuyAmount] = useState('');
  const [sellAmount, setSellAmount] = useState('');
  const [btcBalance, setBtcBalance] = useState('0');
  const [usdtBalance, setUsdtBalance] = useState('0');

  // Bakiyeleri güncelleyen fonksiyon
  const fetchBalances = async () => {
    try {
      const btc = await getBtcBalance();
      const usdt = await getUsdtBalance();
      setBtcBalance(btc);
      setUsdtBalance(usdt);
    } catch (error) {
      console.error('Bakiye çekme hatası:', error);
    }
  };

  useEffect(() => {
    fetchBalances(); // İlk açılışta bakiyeleri çek
    const interval = setInterval(fetchBalances, 1000); //1 saniyede bir güncelle

    return () => clearInterval(interval); // Component unmount olduğunda temizle
  }, []);

  const handleBuy = async () => {
    try {
      await tradeMarketOrder('BUY', buyAmount);
      setBuyAmount(''); // Input'u temizle
      fetchBalances(); // Güncelle
    } catch (error) {
      console.error('Alım hatası:', error);
    }
  };

  const handleSell = async () => {
    try {
      await tradeMarketOrder('SELL', sellAmount);
      setSellAmount(''); // Input'u temizle
      fetchBalances(); // Güncelle
    } catch (error) {
      console.error('Satım hatası:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <Text style={styles.title}>KRİPTO RADAR</Text>

      <LinearGradient colors={['#00b894', '#1e1e1e']} style={styles.livePriceContainer}>
        <Text style={styles.sectionTitle}>Canlı Fiyat</Text>
        <LivePrice />
      </LinearGradient>

      <LinearGradient colors={['#00b894', '#1e1e1e']} style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>TradingView Grafik</Text>
        <TradingViewChart />
      </LinearGradient>

      <LinearGradient colors={['#00b894', '#1e1e1e']} style={styles.tradeContainer}>
        <Text style={styles.sectionTitle}>Alım-Satım</Text>

        <Text style={styles.balance}>USDT Bakiyen: {usdtBalance} USDT</Text>
        <TextInput
          style={styles.input}
          placeholder="Alım miktarını girin (USDT)"
          placeholderTextColor="#ddd"
          keyboardType="numeric"
          value={buyAmount}
          onChangeText={setBuyAmount}
        />
        <Button title="AL (BUY)" onPress={handleBuy} color="#00ff00" />

        <Text style={styles.balance}>BTC Bakiyen: {btcBalance} BTC</Text>
        <TextInput
          style={styles.input}
          placeholder="Satım miktarını girin (BTC)"
          placeholderTextColor="#ddd"
          keyboardType="numeric"
          value={sellAmount}
          onChangeText={setSellAmount}
        />
        <Button title="SAT (SELL)" onPress={handleSell} color="#ff0000" />
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', paddingHorizontal: 20, paddingTop: 40 },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: '#f1f1f1', marginBottom: 12 },
  livePriceContainer: { borderRadius: 20, padding: 25, marginVertical: 18 },
  chartContainer: { borderRadius: 20, padding: 20, marginBottom: 50 },
  tradeContainer: { borderRadius: 20, padding: 20, marginBottom: 50 },
  balance: { fontSize: 18, fontWeight: 'bold', color: '#ffffff', marginBottom: 10 },
  input: { backgroundColor: '#333', color: '#fff', padding: 10, borderRadius: 10, marginBottom: 10 },
  title: { textAlign: 'center', fontSize: 32, fontWeight: '900', color: '#ffffff', marginBottom: 20 }
});
