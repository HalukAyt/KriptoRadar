import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LivePrice = () => {
  const [price, setPrice] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPrice(parseFloat(data.p).toFixed(2)); // Fiyatı güncelle
    };

    return () => ws.close(); // Bileşen kapatıldığında WebSocket bağlantısını kapat
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>BTC/USDT Canlı Fiyat: ${price}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LivePrice;
