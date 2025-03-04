import { BINANCE_API_KEY, BINANCE_API_SECRET } from '@env';
const Binance = require('binance-api-react-native').default;

// Binance API Bağlantısı
const binance = new Binance({
  apiKey: BINANCE_API_KEY,
  apiSecret: BINANCE_API_SECRET,
});

// ✅ BTC Bakiyesini Al
export const getBtcBalance = async (): Promise<string> => {
  try {
    const account = await binance.accountInfo();
    const btcBalance = account.balances.find((b: { asset: string }) => b.asset === 'BTC');
    return btcBalance ? btcBalance.free : '0';
  } catch (error: any) {
    console.error('BTC bakiyesi alınırken hata oluştu:', error);
    return '0'; 
  }
};

// ✅ USDT Bakiyesini Al
export const getUsdtBalance = async (): Promise<string> => {
  try {
    const account = await binance.accountInfo();
    const usdtBalance = account.balances.find((b: { asset: string }) => b.asset === 'USDT');
    return usdtBalance ? usdtBalance.free : '0';
  } catch (error: any) {
    console.error('USDT bakiyesi alınırken hata oluştu:', error);
    return '0'; 
  }
};

// ✅ Market Order ile Alım / Satım İşlemi Yap
export const tradeMarketOrder = async (side: 'BUY' | 'SELL', quantity: string) => {
  try {
    const orderData = {
      symbol: 'BTCUSDT',
      side,
      type: 'MARKET',
      ...(side === 'BUY' ? { quoteOrderQty: quantity } : { quantity }),
    };

    const orderResponse = await binance.order(orderData);
    console.log(`${side} Market Order Başarılı:`, orderResponse);
    alert(`Başarıyla ${side === 'BUY' ? 'ALIM' : 'SATIM'} yapıldı!`);
  } catch (error: any) {
    console.error(`${side} market order hatası:`, error);
    alert(`İşlem başarısız: ${error.message || 'Bilinmeyen hata'}`);
  }
};

// ✅ Limit Order ile Alım / Satım İşlemi Yap
export const tradeLimitOrder = async (side: 'BUY' | 'SELL', quantity: string, price: string) => {
  try {
    const orderData = {
      symbol: 'BTCUSDT',
      side,
      type: 'LIMIT',
      timeInForce: 'GTC', // GTC: Good 'Til Canceled
      quantity,
      price,
    };

    const orderResponse = await binance.order(orderData);
    console.log(`${side} Limit Order Başarılı:`, orderResponse);
    alert(`Limit ${side === 'BUY' ? 'ALIM' : 'SATIM'} emri verildi!`);
  } catch (error: any) {
    console.error(`${side} limit order hatası:`, error);
    alert(`Limit order başarısız: ${error.message || 'Bilinmeyen hata'}`);
  }
};
