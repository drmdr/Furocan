const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting ShampooTracker deployment...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);

  // Get account balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");

  // Deploy the contract
  console.log("🔨 Deploying ShampooTracker contract...");
  const ShampooTracker = await ethers.getContractFactory("ShampooTracker");
  const shampooTracker = await ShampooTracker.deploy();

  await shampooTracker.waitForDeployment();

  const contractAddress = await shampooTracker.getAddress();
  console.log("✅ ShampooTracker deployed to:", contractAddress);

  // Get deployment transaction details
  const deploymentTx = shampooTracker.deploymentTransaction();
  if (deploymentTx) {
    console.log("📋 Deployment transaction hash:", deploymentTx.hash);
    console.log("⛽ Gas used:", deploymentTx.gasLimit.toString());
  }

  // Verify the contract is working
  console.log("🧪 Testing contract functionality...");
  
  // Test recordShampoo function
  const tx = await shampooTracker.recordShampoo();
  await tx.wait();
  console.log("✅ Successfully recorded shampoo!");

  // Check the count
  const count = await shampooTracker.getShampooCount(deployer.address);
  console.log("📊 Shampoo count for deployer:", count.toString());

  // Get the history
  const history = await shampooTracker.getShampooHistory(deployer.address);
  console.log("📚 Shampoo history length:", history.length);

  console.log("\n🎉 Deployment completed successfully!");
  console.log("📋 Contract Address:", contractAddress);
  
  // Get network info
  const network = await ethers.provider.getNetwork();
  console.log("🌐 Network:", network.name);
  console.log("⛓️  Chain ID:", network.chainId.toString());

  // Save deployment info
  const deploymentInfo = {
    contractAddress,
    network: network.name,
    chainId: network.chainId.toString(),
    deployerAddress: deployer.address,
    deploymentTxHash: deploymentTx?.hash,
    timestamp: new Date().toISOString(),
  };

  console.log("\n📄 Deployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });