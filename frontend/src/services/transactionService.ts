import { apiJson } from "./api";
import { createLogger } from "../lib/logger";
import type { PendingTransaction } from "../lib/types";

const log = createLogger("TransactionService");

export interface TransactionConfirmResult {
  id: string;
  description: string;
  amount: number;
  trans_date: string;
  category: string;
  merchant_name: string | null;
}

export async function confirmTransaction(
  tx: PendingTransaction
): Promise<TransactionConfirmResult> {
  const payload = { ...tx, amount: Math.abs(tx.amount) };
  log.info("Confirming transaction", { description: payload.description, amount: payload.amount });
  return apiJson<TransactionConfirmResult>("/transactions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
