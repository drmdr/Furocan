// ShampooTracker contract configuration
export const SHAMPOO_TRACKER_ABI = [
  {
    "type": "function",
    "name": "recordShampoo",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getShampooHistory",
    "inputs": [
      {
        "name": "user",
        "type": "address"
      }
    ],
    "outputs": [
      {
        "components": [
          {
            "name": "user",
            "type": "address"
          },
          {
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "name": "blockNumber",
            "type": "uint256"
          }
        ],
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getShampooCount",
    "inputs": [
      {
        "name": "user",
        "type": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getLatestShampoo",
    "inputs": [
      {
        "name": "user",
        "type": "address"
      }
    ],
    "outputs": [
      {
        "components": [
          {
            "name": "user",
            "type": "address"
          },
          {
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "name": "blockNumber",
            "type": "uint256"
          }
        ],
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "ShampooRecorded",
    "inputs": [
      {
        "indexed": true,
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "timestamp",
        "type": "uint256"
      }
    ]
  }
] as const;

// Contract addresses for different networks
export const CONTRACT_ADDRESSES = {
  // Base Sepolia testnet - update this with your deployed contract address
  84532: '0x0000000000000000000000000000000000000000', // placeholder
  // Base mainnet - update when deploying to mainnet
  8453: '0x0000000000000000000000000000000000000000', // placeholder
  // Local hardhat network
  31337: '0x5FbDB2315678afecb367f032d93F642f64180aa3', // default hardhat address
} as const;

export type ShampooEvent = {
  user: string;
  timestamp: bigint;
  blockNumber: bigint;
};