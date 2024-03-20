const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(
  "https://eth-mainnet.g.alchemy.com/v2/PdAq5ydIInbxKVSOmwTD5TIYk51FnMXD"
);

const ERC721_TRANSFER_EVENT_SIG_HASH = ethers.utils.id(
  "transfer(address,address,uint256)"
);

console.log("====================================");
console.log(ERC721_TRANSFER_EVENT_SIG_HASH);
console.log("====================================");

// Fetch ERC721 Transfer events within a block range
async function getERC721TransfersByBlockRange(fromBlock, toBlock) {
  const filter = {
    fromBlock,
    toBlock,
    topics: [ERC721_TRANSFER_EVENT_SIG_HASH],
  };

  try {
    const logs = await provider.getLogs(filter);
    console.log(
      `Found ${logs.length} ERC721 Transfer event(s) between blocks ${fromBlock} and ${toBlock}`
    );
    return logs;
  } catch (error) {
    console.error("Error fetching logs:", error);
    return [];
  }
}

function displayLogs(logs) {
  logs.forEach((log, index) => {
    console.log(`Log #${index + 1}:`);
    console.log(`  Block Number: ${log.blockNumber}`);
    console.log(`  Transaction Hash: ${log.transactionHash}`);
    console.log(`  From: ${log.topics[1]}`);
    console.log(`  To: ${log.topics[2]}`);

    if (log.data !== "0x") {
      console.log(
        `  Token ID: ${ethers.utils.defaultAbiCoder
          .decode(["uint256"], log.data)[0]
          .toString()}`
      );
    } else {
      console.log("  Token ID: N/A (data is empty)");
    }

    console.log("----------------------------------------");
  });
}

// Main function to fetch and display  Transfer events
async function main() {
  const fromBlock = 19473571;
  const toBlock = 19473572;

  const logs = await getERC721TransfersByBlockRange(fromBlock, toBlock);
  if (logs.length > 0) {
    displayLogs(logs);
  } else {
    console.log(
      `No ERC721 Transfer events found between blocks ${fromBlock} and ${toBlock}.`
    );
  }
}

main().catch(console.error);
