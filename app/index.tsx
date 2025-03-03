import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import LivePrice from '../LivePrice';
import TradingViewChart from '../TradingViewChart';

export default function App() {
  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>KRİPTO RADAR</Text>
      {/* Canlı fiyat kısmı */}
      <View style={styles.livePriceContainer}>
        
        <Text style={styles.sectionTitle}>Canlı Fiyat</Text>
        <LivePrice />
      </View>

      {/* TradingView grafik kısmı */}
      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>TradingView Grafik</Text>
        <TradingViewChart />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Soft light background
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#495057', // Slightly lighter color for section titles
    marginBottom: 10,
  },
  livePriceContainer: {
    backgroundColor: '#ffffff', // White background for card
    borderRadius: 15,
    padding: 20,
    marginVertical: 15,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8, // More prominent shadow for a modern feel
  },
  chartContainer: {
    backgroundColor: '#ffffff', // White background for chart container
    borderRadius: 15,
    padding: 15,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8, // Same shadow effect for consistency
  },
  title:{
    textAlign:"center",
    fontSize: 25,
    fontWeight: "bold"
  }
});
