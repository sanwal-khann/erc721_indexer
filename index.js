const { ethers } = require("ethers");
const fs = require("fs");

async function startListening() {
  // Ethereum node RPC endpoint
  const rpcUrl =
    "https://eth-mainnet.g.alchemy.com/v2/PdAq5ydIInbxKVSOmwTD5TIYk51FnMXD";

  // Read ABI from JSON file
  const abiFilePath = "./usdt.json";
  const abi = JSON.parse(fs.readFileSync(abiFilePath, "utf-8"));

  // Contract address
  const contractAddress = "0x6740ce1bDBbFAD351Ec6232faa8c110eBEae36Bf";

  // Create provider for connection
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

  // Contract instance
  const contract = new ethers.Contract(contractAddress, abi, provider);

  // Event filter for ERC721 Transfer events
  const transferFilter = contract.filters.Transfer(null, null, null);

  // Listen for ERC721 transfer events
  contract.on(transferFilter, async (from, to, tokenId, event) => {
    // Access all log properties
    console.log("Log Properties:");
    console.log("Address:", event.address);
    console.log("Block Hash:", event.blockHash);
    console.log("Block Number:", event.blockNumber.toString());
    console.log("Log Index:", event.logIndex.toString());
    console.log("Topics:", event.topics);
    console.log("Data:", event.data);
    console.log("");

    // Function to handle ERC721 transfer events
    async function handleERC721TransferEvent(from, to, tokenId) {
      // Perform event filtering for self-transfers
      if (from !== to) {
        console.log("Indexed ERC721 Transfer Event:");
        console.log("From:", from);
        console.log("To:", to);
        console.log("Token ID:", tokenId.toString());
        console.log("");
      }
    }

    // Call the function to handle ERC721 transfer events
    await handleERC721TransferEvent(from, to, tokenId);
  });

  console.log("Listening for ERC721 token transfer events ...");
}

// Start listening for events
startListening();
