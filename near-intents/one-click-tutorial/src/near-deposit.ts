import { Account, JsonRpcProvider, type KeyPairString } from 'near-api-js';
import { NEAR } from 'near-api-js/tokens';

import type { TutorialConfig } from './config.js';

interface StorageBalance {
  total: string;
  available: string;
}

interface StorageBalanceBounds {
  min: string;
  max: string | null;
}

function getSenderAccount(config: TutorialConfig): Account {
  if (!config.senderNearAccount || !config.senderPrivateKey) {
    throw new Error('Missing SENDER_NEAR_ACCOUNT or SENDER_PRIVATE_KEY.');
  }

  const provider = new JsonRpcProvider({ url: config.nearRpcUrl });
  return new Account(
    config.senderNearAccount,
    provider,
    config.senderPrivateKey as KeyPairString,
  );
}

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
  const account = getSenderAccount(config);

  // 送信先のアカウントID、送金額、トークンを指定してNEARを送金する
  const result = await account.transfer({
    receiverId,
    amount,
    token: NEAR,
  });

  return result.transaction.hash;
}

async function ensureNep141StorageRegistration(
  account: Account,
  tokenContractId: string,
  receiverId: string,
): Promise<void> {
  const storageBalance = (await account.provider.callFunction<StorageBalance>({
    contractId: tokenContractId,
    method: 'storage_balance_of',
    args: { account_id: receiverId },
  })) as StorageBalance | null | undefined;

  if (storageBalance) {
    return;
  }

  const bounds = await account.provider.callFunction<StorageBalanceBounds>({
    contractId: tokenContractId,
    method: 'storage_balance_bounds',
    args: {},
  });

  if (!bounds?.min) {
    throw new Error(
      `Could not read storage_balance_bounds from ${tokenContractId}.`,
    );
  }

  await account.callFunctionRaw({
    contractId: tokenContractId,
    methodName: 'storage_deposit',
    args: {
      account_id: receiverId,
      registration_only: true,
    },
    gas: 30_000_000_000_000n,
    deposit: BigInt(bounds.min),
  });
}

/**
 * NEP-141トークンを1-Clickのデポジットアカウントへ送金します。
 * @param config
 * @param tokenContractId
 * @param receiverId
 * @param amount
 * @returns
 */
export async function sendNep141Deposit(
  config: TutorialConfig,
  tokenContractId: string,
  receiverId: string,
  amount: string,
): Promise<string> {
  const account = getSenderAccount(config);

  await ensureNep141StorageRegistration(account, tokenContractId, receiverId);

  const result = await account.callFunctionRaw({
    contractId: tokenContractId,
    methodName: 'ft_transfer',
    args: {
      receiver_id: receiverId,
      amount,
    },
    gas: 30_000_000_000_000n,
    deposit: 1n,
  });

  return result.transaction.hash;
}
