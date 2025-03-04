import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, StatusBar, TextInput, Button } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Gradient için gerekli
import LivePrice from '../LivePrice';
import TradingViewChart from '../TradingViewChart';
import { getBtcBalance, getUsdtBalance, tradeMarketOrder } from '../TradeBot'; // Binance API fonksiyonları

export default function App() {
  const [buyAmount, setBuyAmount] = useState(''); // Alım için USDT miktarı
  const [sellAmount, setSellAmount] = useState(''); // Satış için BTC miktarı
  const [btcBalance, setBtcBalance] = useState('0'); // BTC bakiyesi
  const [usdtBalance, setUsdtBalance] = useState('0'); // USDT bakiyesi

  useEffect(() => {
    // Binance API'den bakiyeleri alalım
    async function fetchBalances() {
      const btcBalance = await getBtcBalance();
      const usdtBalance = await getUsdtBalance();
      setBtcBalance(btcBalance);
      setUsdtBalance(usdtBalance);
    }
    fetchBalances();
  }, []);

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

      {/* Alım-Satım İşlemleri */}
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
        <Button title="AL (BUY)" onPress={() => tradeMarketOrder('BUY', buyAmount)} color="#00ff00" />

        <Text style={styles.balance}>BTC Bakiyen: {btcBalance} BTC</Text>
        <TextInput
          style={styles.input}
          placeholder="Satım miktarını girin (BTC)"
          placeholderTextColor="#ddd"
          keyboardType="numeric"
          value={sellAmount}
          onChangeText={setSellAmount}
        />
        <Button title="SAT (SELL)" onPress={() => tradeMarketOrder('SELL', sellAmount)} color="#ff0000" />
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
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-around' },
  title: { textAlign: 'center', fontSize: 32, fontWeight: '900', color: '#ffffff', marginBottom: 20 }
});
