import { Account, JsonRpcProvider, type KeyPairString } from 'near-api-js';
import { NEAR } from 'near-api-js/tokens';

import type { TutorialConfig } from './config.js';

/**
 * NEARを送金するメソッド
 * @param config 
 * @param receiverId 
 * @param amount 
 * @returns 
 */
export async function sendNearDeposit(
  config: TutorialConfig,
  receiverId: string,
  amount: string,
): Promise<string> {
  if (!config.senderNearAccount || !config.senderPrivateKey) {
    throw new Error('Missing SENDER_NEAR_ACCOUNT or SENDER_PRIVATE_KEY.');
  }

  const provider = new JsonRpcProvider({ url: config.nearRpcUrl });
  // Near用のsignerオブジェクトを生成する
  const account = new Account(
    config.senderNearAccount,
    provider,
    config.senderPrivateKey as KeyPairString,
  );
  
  // 送信先のアカウントID、送金額、トークンを指定してNEARを送金する
  const result = await account.transfer({
    receiverId,
    amount,
    token: NEAR,
  });

  return result.transaction.hash;
}
