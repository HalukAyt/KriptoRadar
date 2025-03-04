import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

const TradingViewChart = () => {
  const onError = (e) => {
    console.log('WebView Error:', e.nativeEvent);
  };

  const onHttpError = (e) => {
    console.log('WebView HTTP Error:', e.nativeEvent);
  };

  return (
    <View style={styles.container}>
      <WebView
        source={{
          uri: 'https://www.tradingview.com/widgetembed/?frameElementId=tradingview_12345&symbol=BINANCE%3ABTCUSDT&interval=15&theme=dark'
        }}
        style={{ height: Dimensions.get('window').height / 2 }} // Yüksekliği dinamik olarak ayarladık
        onError={onError}
        onHttpError={onHttpError}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10, // WebView etrafında biraz boşluk
  },
});

export default TradingViewChart;
