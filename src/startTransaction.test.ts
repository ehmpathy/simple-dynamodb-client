import { DynamoDB } from 'aws-sdk';

import { del } from './delete';
import { put } from './put';
import { startTransaction } from './startTransaction';

const logDebug = () => jest.fn();

jest.mock('aws-sdk', () => {
  const transactWritePromiseMock = jest.fn();
  const transactWriteMock = jest.fn().mockImplementation(() => ({ promise: transactWritePromiseMock }));
  return {
    DynamoDB: {
      DocumentClient: jest.fn(() => ({
        transactWrite: transactWriteMock,
      })),
    },
  };
});

const transactWriteMock = new DynamoDB.DocumentClient().transactWrite as jest.Mock;
const transactWritePromiseMock = new DynamoDB.DocumentClient().transactWrite({} as any).promise as jest.Mock;

describe('beginWriteTransaction', () => {
  it('should be possible to queue a put', async () => {
    const transaction = startTransaction();
    transaction.queue.put({ tableName: 'spaceships', item: { fuel: 9000 }, logDebug });
  });
  it('should be possible to interchange queue.put and normal put', async () => {
    const input = { tableName: 'spaceships', item: { fuel: 9000 }, logDebug };

    // input works for normal request
    put(input);

    // input works for transaction too
    const transaction = startTransaction();
    transaction.queue.put(input);
  });

  it('should be possible to queue a delete', async () => {
    const transaction = startTransaction();
    transaction.queue.delete({ tableName: 'spaceships', key: { p: 'uuid' }, logDebug });
  });
  it('should be possible to interchange queue.put and normal put', async () => {
    const input = { tableName: 'spaceships', key: { p: 'uuid' }, logDebug };

    // input works for normal request
    del(input);

    // input works for transaction too
    const transaction = startTransaction();
    transaction.queue.delete(input);
  });

  it('should accurately execute a transaction', async () => {
    const transaction = startTransaction();
    transaction.queue.put({ tableName: 'spaceships', item: { id: 821, fuel: 9000 }, logDebug });
    transaction.queue.put({ tableName: 'spaceport', item: { spaceships: [{ id: 821 }] }, logDebug });
    transaction.queue.delete({ tableName: 'cargo-to-spaceship', key: { p: 'SOIL', s: 821 }, logDebug });
    transaction.queue.put({ tableName: 'cargo-to-spaceship', item: { p: 'SOIL', s: 721, quantity: 7 }, logDebug });
    await transaction.execute({ logDebug });
    expect(transactWritePromiseMock).toHaveBeenCalledTimes(1);
    expect(transactWriteMock).toHaveBeenCalledWith({
      TransactItems: [
        {
          Put: {
            TableName: 'spaceships',
            Item: { id: 821, fuel: 9000 },
            ConditionExpression: undefined,
          },
        },
        {
          Put: {
            TableName: 'spaceport',
            Item: { spaceships: [{ id: 821 }] },
            ConditionExpression: undefined,
          },
        },
        {
          Delete: {
            TableName: 'cargo-to-spaceship',
            Key: {
              p: 'SOIL',
              s: 821,
            },
            ConditionExpression: undefined,
          },
        },
        {
          Put: {
            TableName: 'cargo-to-spaceship',
            Item: {
              p: 'SOIL',
              s: 721,
              quantity: 7,
            },
            ConditionExpression: undefined,
          },
        },
      ],
    });
  });
});
