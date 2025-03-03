import React from 'react';
import { View, StyleSheet } from 'react-native';
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
        source={{ uri: 'https://www.tradingview.com/widgetembed/?frameElementId=tradingview_12345&symbol=BINANCE%3ABTCUSDT' }}
        style={{height:400}}
        onError={onError}
        onHttpError={onHttpError}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,  // WebView etrafında biraz boşluk
  },

});

export default TradingViewChart;
