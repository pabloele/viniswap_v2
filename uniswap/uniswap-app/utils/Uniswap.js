export const UniswapABI = [
  {
    inputs: [
      {
        internalType: 'string',
        name: 'tokenName',
        type: 'string',
      },
    ],
    name: 'swapEthToToken',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'tokenName',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
    ],
    name: 'swapTokenToEth',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'srcTokenName',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'destTokenName',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
    ],
    name: 'swapTokenToToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'tokenName',
        type: 'string',
      },
      {
        internalType: 'address',
        name: '_address',
        type: 'address',
      },
    ],
    name: 'getBalance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getEthBalance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'tokenName',
        type: 'string',
      },
    ],
    name: 'getName',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'tokenName',
        type: 'string',
      },
    ],
    name: 'getTokenAddress',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    name: 'tokenInstanceMap',
    outputs: [
      {
        internalType: 'contract ERC20',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'tokens',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

// export const UniswapABI = {
//   name: 'Uniswap',
//   address: '0x345877e04323c905d6777038a91d6e2aab60f85b',
//   abi: [
//     {
//       inputs: [
//         {
//           internalType: 'string',
//           name: 'tokenName',
//           type: 'string',
//         },
//       ],
//       name: 'swapEthToToken',
//       outputs: [
//         {
//           internalType: 'uint256',
//           name: '',
//           type: 'uint256',
//         },
//       ],
//       stateMutability: 'payable',
//       type: 'function',
//     },
//     {
//       inputs: [
//         {
//           internalType: 'string',
//           name: 'tokenName',
//           type: 'string',
//         },
//         {
//           internalType: 'uint256',
//           name: '_amount',
//           type: 'uint256',
//         },
//       ],
//       name: 'swapTokenToEth',
//       outputs: [
//         {
//           internalType: 'uint256',
//           name: '',
//           type: 'uint256',
//         },
//       ],
//       stateMutability: 'nonpayable',
//       type: 'function',
//     },
//     {
//       inputs: [
//         {
//           internalType: 'string',
//           name: 'srcTokenName',
//           type: 'string',
//         },
//         {
//           internalType: 'string',
//           name: 'destTokenName',
//           type: 'string',
//         },
//         {
//           internalType: 'uint256',
//           name: '_amount',
//           type: 'uint256',
//         },
//       ],
//       name: 'swapTokenToToken',
//       outputs: [],
//       stateMutability: 'nonpayable',
//       type: 'function',
//     },
//     {
//       inputs: [],
//       stateMutability: 'nonpayable',
//       type: 'constructor',
//     },
//     {
//       inputs: [
//         {
//           internalType: 'string',
//           name: 'tokenName',
//           type: 'string',
//         },
//         {
//           internalType: 'address',
//           name: '_address',
//           type: 'address',
//         },
//       ],
//       name: 'getBalance',
//       outputs: [
//         {
//           internalType: 'uint256',
//           name: '',
//           type: 'uint256',
//         },
//       ],
//       stateMutability: 'view',
//       type: 'function',
//     },
//     {
//       inputs: [],
//       name: 'getEthBalance',
//       outputs: [
//         {
//           internalType: 'uint256',
//           name: '',
//           type: 'uint256',
//         },
//       ],
//       stateMutability: 'view',
//       type: 'function',
//     },
//     {
//       inputs: [
//         {
//           internalType: 'string',
//           name: 'tokenName',
//           type: 'string',
//         },
//       ],
//       name: 'getName',
//       outputs: [
//         {
//           internalType: 'string',
//           name: '',
//           type: 'string',
//         },
//       ],
//       stateMutability: 'view',
//       type: 'function',
//     },
//     {
//       inputs: [
//         {
//           internalType: 'string',
//           name: 'tokenName',
//           type: 'string',
//         },
//       ],
//       name: 'getTokenAddress',
//       outputs: [
//         {
//           internalType: 'address',
//           name: '',
//           type: 'address',
//         },
//       ],
//       stateMutability: 'view',
//       type: 'function',
//     },
//     {
//       inputs: [
//         {
//           internalType: 'string',
//           name: '',
//           type: 'string',
//         },
//       ],
//       name: 'tokenInstanceMap',
//       outputs: [
//         {
//           internalType: 'contract ERC20',
//           name: '',
//           type: 'address',
//         },
//       ],
//       stateMutability: 'view',
//       type: 'function',
//     },
//     {
//       inputs: [
//         {
//           internalType: 'uint256',
//           name: '',
//           type: 'uint256',
//         },
//       ],
//       name: 'tokens',
//       outputs: [
//         {
//           internalType: 'string',
//           name: '',
//           type: 'string',
//         },
//       ],
//       stateMutability: 'view',
//       type: 'function',
//     },
//   ],
//   filePath: ' - connect to localhost - /Uniswap.sol',
//   pinnedAt: 1712117541276,
// };
