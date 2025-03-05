import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, StatusBar, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LivePrice from '../LivePrice';
import TradingViewChart from '../TradingViewChart';
import { getBtcBalance, getUsdtBalance, tradeMarketOrder, tradeLimitOrder, getLimitOrders } from '../TradeBot';

export default function Home() {
  const [buyAmount, setBuyAmount] = useState(''); // Alım miktarı (USDT)
  const [buyLimitPrice, setBuyLimitPrice] = useState(''); // Alım limit fiyatı (USDT)
  const [sellAmount, setSellAmount] = useState(''); // Satım miktarı (BTC)
  const [sellLimitPrice, setSellLimitPrice] = useState(''); // Satım limit fiyatı (USDT)
  const [btcBalance, setBtcBalance] = useState('0'); // BTC bakiyesi
  const [usdtBalance, setUsdtBalance] = useState('0'); // USDT bakiyesi
  const [limitOrders, setLimitOrders] = useState<any[]>([]); // Limit emirlerini saklayacağımız state
  const [loading, setLoading] = useState(false); // Yükleniyor durumu için state

  // Bakiyeleri güncelleyen fonksiyon
  const fetchBalances = async () => {
    setLoading(true);
    try {
      const btc = await getBtcBalance();
      const usdt = await getUsdtBalance();
      setBtcBalance(btc);
      setUsdtBalance(usdt);
    } catch (error) {
      console.error('Bakiye çekme hatası:', error);
    }
    setLoading(false);
  };

  // Limit emirlerini çekmek için fonksiyon
  const fetchLimitOrders = async () => {
    setLoading(true);
    try {
      const orders = await getLimitOrders(); // Limit emirlerini al
      setLimitOrders(orders); // Limit emirlerini state'e ata
    } catch (error) {
      console.error('Limit emirlerini alırken hata oluştu:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBalances(); // İlk açılışta bakiyeleri çek
    fetchLimitOrders(); // İlk açılışta limit emirlerini çek
    const interval = setInterval(() => {
      fetchBalances(); // 1 saniyede bir bakiyeleri güncelle
      fetchLimitOrders(); // 1 saniyede bir limit emirlerini güncelle
    }, 1000);

    return () => clearInterval(interval); // Component unmount olduğunda temizle
  }, []);

  const handleMarketBuy = async () => {
    if (!buyAmount || parseFloat(buyAmount) <= 0) {
      Alert.alert('Hata', 'Lütfen geçerli bir alım miktarı girin.');
      return;
    }
    try {
      await tradeMarketOrder('BUY', buyAmount);
      setBuyAmount(''); // Input'u temizle
      fetchBalances(); // Bakiyeleri güncelle
      Alert.alert('Başarı', 'Market alım işlemi başarılı!');
    } catch (error) {
      console.error('Market alım hatası:', error);
      Alert.alert('Hata', 'Market alım işlemi başarısız.');
    }
  };

  const handleMarketSell = async () => {
    if (!sellAmount || parseFloat(sellAmount) <= 0) {
      Alert.alert('Hata', 'Lütfen geçerli bir satım miktarı girin.');
      return;
    }
    try {
      await tradeMarketOrder('SELL', sellAmount);
      setSellAmount(''); // Input'u temizle
      fetchBalances(); // Bakiyeleri güncelle
      Alert.alert('Başarı', 'Market satım işlemi başarılı!');
    } catch (error) {
      console.error('Market satım hatası:', error);
      Alert.alert('Hata', 'Market satım işlemi başarısız.');
    }
  };

  const handleLimitBuy = async () => {
    if (!buyAmount || parseFloat(buyAmount) <= 0 || !buyLimitPrice || parseFloat(buyLimitPrice) <= 0) {
      Alert.alert('Hata', 'Lütfen geçerli bir alım miktarı ve limit fiyatı girin.');
      return;
    }
  
    // USDT ile alım yapacağımız için, BTC miktarını hesapla
    const btcAmount = (parseFloat(buyAmount) / parseFloat(buyLimitPrice)).toFixed(6); // BTC miktarını hesapla
  
    if (parseFloat(btcAmount) <= 0) {
      Alert.alert('Hata', 'Geçerli bir BTC miktarı hesaplanamadı.');
      return;
    }
  
    try {
      await tradeLimitOrder('BUY', btcAmount, buyLimitPrice); // Hesaplanan BTC miktarı ile alım işlemi yap
      setBuyAmount(''); // Input'u temizle
      setBuyLimitPrice(''); // Input'u temizle
      fetchBalances(); // Bakiyeleri güncelle
      Alert.alert('Başarı', `Limit alım emri başarıyla verildi! ${btcAmount} BTC @ ${buyLimitPrice} USDT`);
    } catch (error) {
      console.error('Limit alım hatası:', error);
      Alert.alert('Hata', 'Limit alım emri başarısız.');
    }
  };

  const handleLimitSell = async () => {
    if (!sellAmount || parseFloat(sellAmount) <= 0 || !sellLimitPrice || parseFloat(sellLimitPrice) <= 0) {
      Alert.alert('Hata', 'Lütfen geçerli bir satım miktarı ve limit fiyatı girin.');
      return;
    }
    try {
      await tradeLimitOrder('SELL', sellAmount, sellLimitPrice);
      setSellAmount(''); // Input'u temizle
      setSellLimitPrice(''); // Input'u temizle
      fetchBalances(); // Bakiyeleri güncelle
      Alert.alert('Başarı', 'Limit satım emri başarıyla verildi!');
    } catch (error) {
      console.error('Limit satım hatası:', error);
      Alert.alert('Hata', 'Limit satım emri başarısız.');
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
        <Text style={styles.sectionTitle}>Market Order Alım-Satım</Text>

        <Text style={styles.balance}>USDT Bakiyen: {usdtBalance} USDT</Text>
        <TextInput
          style={styles.input}
          placeholder="Alım miktarını girin (USDT)"
          placeholderTextColor="#ddd"
          keyboardType="numeric"
          value={buyAmount}
          onChangeText={setBuyAmount}
        />
        <Button title="Market AL (BUY)" onPress={handleMarketBuy} color="#00ff00" />

        <Text style={styles.balance}>BTC Bakiyen: {btcBalance} BTC</Text>
        <TextInput
          style={styles.input}
          placeholder="Satım miktarını girin (BTC)"
          placeholderTextColor="#ddd"
          keyboardType="numeric"
          value={sellAmount}
          onChangeText={setSellAmount}
        />
        <Button title="Market SAT (SELL)" onPress={handleMarketSell} color="#ff0000" />

        <Text style={styles.sectionTitle}>Limit Order Alım-Satım</Text>

        <Text style={styles.balance}>USDT Bakiyen: {usdtBalance} USDT</Text>
        <TextInput
          style={styles.input}
          placeholder="Limit alım fiyatı girin (USDT)"
          placeholderTextColor="#ddd"
          keyboardType="numeric"
          value={buyLimitPrice}
          onChangeText={setBuyLimitPrice}
        />
        <TextInput
          style={styles.input}
          placeholder="Alım miktarını girin (USDT)"
          placeholderTextColor="#ddd"
          keyboardType="numeric"
          value={buyAmount}
          onChangeText={setBuyAmount}
        />
        <Button title="Limit AL (BUY)" onPress={handleLimitBuy} color="#00ff00" />

        <Text style={styles.balance}>BTC Bakiyen: {btcBalance} BTC</Text>
        <TextInput
          style={styles.input}
          placeholder="Limit satım fiyatı girin (USDT)"
          placeholderTextColor="#ddd"
          keyboardType="numeric"
          value={sellLimitPrice}
          onChangeText={setSellLimitPrice}
        />
        <TextInput
          style={styles.input}
          placeholder="Satım miktarını girin (BTC)"
          placeholderTextColor="#ddd"
          keyboardType="numeric"
          value={sellAmount}
          onChangeText={setSellAmount}
        />
        <Button title="Limit SAT (SELL)" onPress={handleLimitSell} color="#ff0000" />
      </LinearGradient>

      {/* Limit emirlerini listele */}
      <LinearGradient colors={['#00b894', '#1e1e1e']} style={styles.orderContainer}>
        <Text style={styles.sectionTitle}>Aktif Limit Emirleri</Text>
        {limitOrders.length > 0 ? (
          limitOrders.map((order, index) => (
            <View key={index} style={styles.orderItem}>
              <Text style={styles.orderText}>{order.side === 'BUY' ? 'Alım' : 'Satım'}: {order.amount} {order.symbol}</Text>
              <Text style={styles.orderText}>Fiyat: {order.price} USDT</Text>
            </View>
          ))
        ) : (
          <Text style={styles.orderText}>Henüz limit emri yok.</Text>
        )}
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
  orderContainer: { borderRadius: 20, padding: 20, marginBottom: 20 },
  orderItem: { marginBottom: 10 },
  orderText: { color: '#fff' },
  title: { textAlign: 'center', fontSize: 32, fontWeight: '900', color: '#ffffff', marginBottom: 20 },
});
