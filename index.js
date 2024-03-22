
const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(
  "https://eth-mainnet.g.alchemy.com/v2/PdAq5ydIInbxKVSOmwTD5TIYk51FnMXD"
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
              `Block Number: ${blockNumber}, Log Index: ${
                log.topics[0]
              }, ERC721 Transfer - From: ${log.topics[1]}, To: ${
                log.topics[2]
              }, TokenId: ${tokenId.toString()}`
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

indexERC721Transfers(19473571, 19473581).catch(console.error);

// ===============

// require("dotenv").config(); // Load environment variables from .env file

// const { ethers } = require("ethers");

// // Retrieve API key and private key from environment variables
// const { API_KEY } = process.env;

// // Create provider with API key
// const provider = new ethers.providers.JsonRpcProvider(
//   `https://eth-mainnet.g.alchemy.com/v2/${API_KEY}`
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
//       for (let i = 0; i < receipt.logs.length; i++) {
//         const log = receipt.logs[i];
//         if (isERC721Transfer(log)) {
//           try {
//             const tokenId = ethers.BigNumber.from(log.topics[3]);
//             console.log(
//               `Block Number: ${blockNumber}, Log Index: ${i}, ERC721 Transfer - From: ${
//                 log.topics[1]
//               }, To: ${log.topics[2]}, TokenId: ${tokenId.toString()}`
//             );
//           } catch (error) {
//             console.error(
//               `Error processing ERC721 transfer event in block ${blockNumber}, Log Index: ${i}:`,
//               error.message
//             );
//             console.log("Raw log data:", log.data);
//             console.log("Topics:", log.topics);
//           }
//         }
//       }
//     }
//   }
// }

// indexERC721Transfers(19473571, 19473572).catch(console.error);
