import { Account, JsonRpcProvider, type KeyPairString } from 'near-api-js';
import { NEAR } from 'near-api-js/tokens';

import type { TutorialConfig } from './config.js';

export async function sendNearDeposit(
  config: TutorialConfig,
  receiverId: string,
  amount: string,
): Promise<string> {
  if (!config.senderNearAccount || !config.senderPrivateKey) {
    throw new Error('Missing SENDER_NEAR_ACCOUNT or SENDER_PRIVATE_KEY.');
  }

  const provider = new JsonRpcProvider({ url: config.nearRpcUrl });
  const account = new Account(
    config.senderNearAccount,
    provider,
    config.senderPrivateKey as KeyPairString,
  );

  const result = await account.transfer({
    receiverId,
    amount,
    token: NEAR,
  });

  return result.transaction.hash;
}
