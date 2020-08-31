import { del } from './delete';
import { RelevantTransactWriteItemInput, transactWrite } from './dynamodb/transactWrite';
import { put } from './put';
import { LogMethod } from './types';

type PutRequestArgs = Parameters<typeof put>[0];
type DeleteRequestArgs = Parameters<typeof del>[0];

export interface SimpleDynamodbTransaction {
  queue: {
    put: (args: PutRequestArgs) => void;
    delete: (args: DeleteRequestArgs) => void;
  };
  execute: ({ logDebug }: { logDebug: LogMethod }) => Promise<void>;
}

export const startTransaction = (): SimpleDynamodbTransaction => {
  // const queuedReadItems: RelevantTransactReadItemInput[] = []; -> eventually we can support read items too, and just throw an error if someone tries to use same transaction for both read and wrtie
  const queuedWriteItems: RelevantTransactWriteItemInput[] = [];
  return {
    queue: {
      put: (args: PutRequestArgs) =>
        queuedWriteItems.push({
          Put: {
            TableName: args.tableName,
            Item: args.item,
            ConditionExpression: args.putConditions?.ConditionExpression,
          },
        }),
      delete: (args: DeleteRequestArgs) =>
        queuedWriteItems.push({
          Delete: {
            TableName: args.tableName,
            Key: args.key,
            ConditionExpression: args.deleteConditions?.ConditionExpression,
          },
        }),
    },
    execute: async ({ logDebug }: { logDebug: LogMethod }) => {
      logDebug(`writeTransaction.execute.input`, { writeItems: queuedWriteItems });
      await transactWrite({
        input: {
          TransactItems: queuedWriteItems,
        },
      });
      logDebug(`writeTransaction.execute.output`, { success: true, writeItems: queuedWriteItems });
    },
  };
};
