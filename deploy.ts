import { ethers } from 'ethers';
import * as fs from 'fs-extra';
import 'dotenv/config';

const { RPC_URL, PRIVATE_KEY } = process.env;

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL!);
  const wallet = new ethers.Wallet(PRIVATE_KEY!, provider);
  const abi = fs.readFileSync('./SimpleStorage_sol_SimpleStorage.abi', 'utf8');
  const binary = fs.readFileSync(
    './SimpleStorage_sol_SimpleStorage.bin',
    'utf8'
  );

  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log('Deploying, please wait...');

  const contract = await contractFactory.deploy();
  await contract.deployTransaction.wait(1);
  console.log(`Contract deployed to ${contract.address}`);

  const currentFavoriteNumber = await contract.retrieve();
  console.log(`Current favorite number: ${currentFavoriteNumber}`);
  console.log('Updating favorite number...');

  const transactionResponse = await contract.store('7'); // '7' or 7
  const transactionReceipt = await transactionResponse.wait(1);
  console.log(transactionReceipt);

  const updatedFavoriteNumber = await contract.retrieve();
  console.log(`Updated favorite number: ${updatedFavoriteNumber}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
