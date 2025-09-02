// Type definitions for the application

export interface ShampooEvent {
  user: string;           // ウォレットアドレス
  timestamp: number;      // Unix timestamp
  blockNumber: number;    // ブロック番号
  transactionHash: string; // トランザクションハッシュ
}

export interface NoShampooEvent {
  id: string;            // UUID
  date: string;          // YYYY-MM-DD形式
  timestamp: number;     // Unix timestamp
  message: string;       // 表示メッセージ
}

export interface AppState {
  isWalletConnected: boolean;
  walletAddress: string | null;
  isLoading: boolean;
  currentMessage: string | null;
  shampooHistory: ShampooEvent[];
  noShampooHistory: NoShampooEvent[];
}