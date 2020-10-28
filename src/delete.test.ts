import { DynamoDB } from 'aws-sdk';

import { del } from './delete';

jest.mock('aws-sdk', () => {
  const putMock = jest.fn().mockImplementation(() => ({ promise: () => {} }));
  const deleteMock = jest.fn().mockImplementation(() => ({ promise: () => {} }));
  const queryPromiseMock = jest.fn();
  const queryMock = jest.fn().mockImplementation(() => ({ promise: queryPromiseMock }));
  return {
    DynamoDB: {
      DocumentClient: jest.fn(() => ({
        put: putMock,
        query: queryMock,
        delete: deleteMock,
      })),
    },
  };
});

const deleteMock = new DynamoDB.DocumentClient().delete as jest.Mock;

describe('delete', () => {
  beforeEach(() => jest.clearAllMocks());
  it('should be possible to delete an item', async () => {
    const spaceship = {
      registrationNumber: '821-128-821',
      name: 'space-boi',
      maxWeight: 821,
      maxPassengers: 821,
    };
    await del({
      tableName: 'spaceship',
      logDebug: jest.fn(),
      key: { p: spaceship.registrationNumber },
    });

    // check we called aws sdk correctly
    expect(deleteMock).toHaveBeenCalledWith({
      TableName: 'spaceship',
      Key: { p: spaceship.registrationNumber },
      ConditionExpression: undefined,
      ExpressionAttributeValues: undefined,
    });
  });
});
