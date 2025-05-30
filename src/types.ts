export interface TopTokenRequest {
  limit?: number;
}

export interface TopTokenResponse {
  data: any[];
}

export interface TokenDetailsResponse {
  symbol: string;
  name: string;
  price: number;
  market_cap: number;
  rank: number;
}

export interface TokenDetailsResponse {
  symbol: string;
  name: string;
  price: number;
  market_cap: number;
  rank: number;