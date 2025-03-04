const Binance = require('binance-api-react-native').default;

const binance = new Binance({
  apiKey: "UzE48eLkDlZyEpbI4TkWqRdmXcGpUmOWbKk7qvEEvTT7VXPau3unraX9xvbXn6UB",
  apiSecret: "rRn3WzyPa8JknRjh8G0M5wxXWUOU2tapSZH09kZKTQurJoh2G8zD8b0aH0vV5yWb",
});

// BTC Bakiyesini Al
// USDT Bakiyesini Al
export const getUsdtBalance = async () => {
  const account = await binance.accountInfo();
  const usdtBalance = account.balances.find((b: { asset: string; free: string }) => b.asset === 'USDT');
  return usdtBalance ? usdtBalance.free : '0';
};

export const getBtcBalance = async () => {
  try {
    const account = await binance.accountInfo();
    const btcBalance = account.balances.find((b: { asset: string; free: string }) => b.asset === 'BTC');
    return btcBalance ? btcBalance.free : '0';
  } catch (error) {
    console.error('Hata:', error);
    return '0'; // Hata durumunda 0 döndür
  }
};

// Alım-Satım İşlemi Yap
// Alım-Satım İşlemi Yap (USDT cinsinden)
// Alım-Satım İşlemi Yap (USDT ile al, BTC ile sat)
export const tradeMarketOrder = async (side: 'BUY' | 'SELL', quantity: string) => {
  try {
    if (side === 'BUY') {
      // USDT ile alım yapıyoruz
      await binance.order({
        symbol: 'BTCUSDT', // BTC/USDT paritesinde işlem yapıyoruz
        side: 'BUY',
        type: 'MARKET',
        quoteOrderQty: quantity, // USDT cinsinden miktar
      });
      alert(`Başarıyla ALIM yapıldı!`);
    } else if (side === 'SELL') {
      // BTC ile satım yapıyoruz
      await binance.order({
        symbol: 'BTCUSDT', // BTC/USDT paritesinde işlem yapıyoruz
        side: 'SELL',
        type: 'MARKET',
        quantity, // BTC cinsinden miktar
      });
      alert(`Başarıyla SATIM yapıldı!`);
    }
  } catch (error) {
    console.error('Hata:', error);
  }
};

