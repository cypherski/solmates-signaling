export interface TokenData {
  name: string;
  price: number;
  change: number;
  volume: string;
  lastUpdate: Date;
}

export interface Alert {
  type: 'price' | 'volume' | 'social';
  message: string;
  timestamp: Date;
  isRead: boolean;
}

export interface CommunitySignal {
  type: 'buy' | 'sell' | 'hold';
  strength: number;
  count: number;
}