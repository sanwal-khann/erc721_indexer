// const { ethers } = require("ethers");

// const provider = new ethers.providers.JsonRpcProvider(
//   "https://eth-mainnet.g.alchemy.com/v2/PdAq5ydIInbxKVSOmwTD5TIYk51FnMXD"
// );

// const ERC721_TRANSFER_EVENT_SIG_HASH = ethers.utils.id(
//   "Transfer(address,address,uint256)"
// );

// console.log("====================================");
// console.log(ERC721_TRANSFER_EVENT_SIG_HASH);
// console.log("====================================");

// // Fetch ERC721 Transfer events within a block range
// async function getERC721TransfersByBlockRange(fromBlock, toBlock) {
//   const filter = {
//     fromBlock,
//     toBlock,
//     topics: [ERC721_TRANSFER_EVENT_SIG_HASH],
//   };

//   try {
//     const logs = await provider.getLogs(filter);
//     console.log(
//       `Found ${logs.length} ERC721 Transfer event(s) between blocks ${fromBlock} and ${toBlock}`
//     );
//     return logs;
//   } catch (error) {
//     console.error("Error fetching logs:", error);
//     return [];
//   }
// }

// function displayLogs(logs) {
//   logs.forEach((log, index) => {
//     console.log(`Log #${index + 1}:`);
//     console.log(`  Block Number: ${log.blockNumber}`);
//     console.log(`  Transaction Hash: ${log.transactionHash}`);
//     console.log(`  From: ${log.topics[1]}`);
//     console.log(`  To: ${log.topics[2]}`);

//     if (log.data !== "0x") {
//       console.log(
//         `  Token ID: ${ethers.utils.defaultAbiCoder
//           .decode(["uint256"], log.data)[0]
//           .toString()}`
//       );
//     } else {
//       console.log("  Token ID: N/A (data is empty)");
//     }

//     console.log("----------------------------------------");
//   });
// }

// // Main function to fetch and display  Transfer events
// async function main() {
//   const fromBlock = 19473571;
//   const toBlock = 19473572;

//   const logs = await getERC721TransfersByBlockRange(fromBlock, toBlock);
//   if (logs.length > 0) {
//     displayLogs(logs);
//   } else {
//     console.log(
//       `No ERC721 Transfer events found between blocks ${fromBlock} and ${toBlock}.`
//     );
//   }
// }

// main().catch(console.error);

// =================================================
// =================================
// ==========================

// =====================================
// ==================================
// ========================

// const { ethers } = require("ethers");

// const provider = new ethers.providers.JsonRpcProvider(
//   "https://eth-mainnet.g.alchemy.com/v2/PdAq5ydIInbxKVSOmwTD5TIYk51FnMXD"
// );

// // Function to check if the log corresponds to an ERC721 Transfer event
// function isERC721Transfer(log) {
//   return (
//     log.topics.length === 4 &&
//     log.topics[0] === ethers.utils.id("Transfer(address,address,uint256)")
//   );
// }

// // Function to index ERC721 transfer events
// async function indexERC721Transfers(startBlock, endBlock) {
//   for (let blockNumber = startBlock; blockNumber <= endBlock; blockNumber++) {
//     const block = await provider.getBlockWithTransactions(blockNumber);
//     for (const tx of block.transactions) {
//       const receipt = await provider.getTransactionReceipt(tx.hash);
//       if (!receipt) continue;
//       for (const log of receipt.logs) {
//         if (isERC721Transfer(log)) {
//           const tokenId = ethers.BigNumber.from(log.topics[3]);
//           console.log(
//             `ERC721 Transfer - From: ${log.topics[1]}, To: ${
//               log.topics[2]
//             }, TokenId: ${tokenId.toString()}`
//           );
//         }
//       }
//     }
//   }
// }

// indexERC721Transfers(19473571, 19473572).catch(console.error);
require('dotenv').config(); // Load environment variables from .env file

const { ethers } = require("ethers");

// Retrieve API key and private key from environment variables
const { API_KEY } = process.env;

// Create provider with API key
const provider = new ethers.providers.JsonRpcProvider(
  `https://eth-mainnet.g.alchemy.com/v2/${API_KEY}`
);

// Function to check if the log corresponds to an ERC721 Transfer event
function isERC721Transfer(log) {
  return (
    log.topics.length === 4 &&
    log.topics[0] === ethers.utils.id("Transfer(address,address,uint256)")
  );
}

// Function to index ERC721 transfer events
async function indexERC721Transfers(startBlock, endBlock) {
  for (let blockNumber = startBlock; blockNumber <= endBlock; blockNumber++) {
    const block = await provider.getBlockWithTransactions(blockNumber);
    for (const tx of block.transactions) {
      const receipt = await provider.getTransactionReceipt(tx.hash);
      if (!receipt) continue;
      for (let i = 0; i < receipt.logs.length; i++) {
        const log = receipt.logs[i];
        if (isERC721Transfer(log)) {
          try {
            const tokenId = ethers.BigNumber.from(log.topics[3]);
            console.log(
              `Block Number: ${blockNumber}, Log Index: ${i}, ERC721 Transfer - From: ${log.topics[1]}, To: ${log.topics[2]}, TokenId: ${tokenId.toString()}`
            );
          } catch (error) {
            console.error(
              `Error processing ERC721 transfer event in block ${blockNumber}, Log Index: ${i}:`,
              error.message
            );
            console.log("Raw log data:", log.data);
            console.log("Topics:", log.topics);
          }
        }
      }
    }
  }
}

indexERC721Transfers(19473571, 19473572).catch(console.error);
