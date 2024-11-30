import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { TokenData, Alert } from '@/types/token';

interface TokenState {
  assets: TokenData[];
  alerts: Alert[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TokenState = {
  assets: [
    { name: 'SOL', price: 0, change: 0, volume: '0', lastUpdate: new Date() },
    { name: 'BONK', price: 0, change: 0, volume: '0', lastUpdate: new Date() },
    { name: 'JUP', price: 0, change: 0, volume: '0', lastUpdate: new Date() }
  ],
  alerts: [],
  isLoading: true,
  error: null
};

export function useTokenData() {
  const [data, setData] = useState<TokenState>(initialState);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const { data: prices, error } = await supabase
          .from('token_prices')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(1);

        if (error) throw error;

        if (prices && prices.length > 0) {
          setData(prev => ({
            ...prev,
            assets: prev.assets.map(asset => ({
              ...asset,
              price: prices[0][asset.name.toLowerCase()],
              lastUpdate: new Date(prices[0].timestamp)
            })),
            isLoading: false
          }));
        }
      } catch (error) {
        setData(prev => ({
          ...prev,
          error: 'Failed to fetch token data',
          isLoading: false
        }));
      }
    };

    fetchInitialData();

    // Subscribe to real-time updates
    const priceSubscription = supabase
      .channel('token-prices')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'token_prices'
      }, payload => {
        setData(prev => ({
          ...prev,
          assets: prev.assets.map(asset => {
            const newPrice = payload.new[asset.name.toLowerCase()];
            const oldPrice = asset.price;
            return {
              ...asset,
              price: newPrice,
              change: oldPrice > 0 ? ((newPrice - oldPrice) / oldPrice) * 100 : 0,
              lastUpdate: new Date(payload.new.timestamp)
            };
          })
        }));
      })
      .subscribe();

    return () => {
      priceSubscription.unsubscribe();
    };
  }, []);

  const markAlertAsRead = (index: number) => {
    setData(prev => ({
      ...prev,
      alerts: prev.alerts.map((alert, i) => 
        i === index ? { ...alert, isRead: true } : alert
      )
    }));
  };

  return {
    ...data,
    markAlertAsRead
  };
}