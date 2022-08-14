import { ethers } from 'ethers';
import * as fs from 'fs-extra';
import 'dotenv/config';

const { PRIVATE_KEY, PRIVATE_KEY_PASSWORD } = process.env;

async function main() {
  const wallet = new ethers.Wallet(PRIVATE_KEY!);

  const encryptedJsonKey = await wallet.encrypt(
    PRIVATE_KEY_PASSWORD!,
    PRIVATE_KEY!
  );

  console.log(encryptedJsonKey);
  fs.writeFileSync('./.encryptedKey.json', encryptedJsonKey);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
