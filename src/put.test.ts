import { DynamoDB } from 'aws-sdk';

import { put } from './put';

jest.mock('aws-sdk', () => {
  const putMock = jest.fn().mockImplementation(() => ({ promise: () => {} }));
  const queryPromiseMock = jest.fn();
  const queryMock = jest.fn().mockImplementation(() => ({ promise: queryPromiseMock }));
  return {
    DynamoDB: {
      DocumentClient: jest.fn(() => ({
        put: putMock,
        query: queryMock,
      })),
    },
  };
});

const putMock = new DynamoDB.DocumentClient().put as jest.Mock;

describe('put', () => {
  beforeEach(() => jest.clearAllMocks());
  it('should be possible to put an item', async () => {
    const spaceship = {
      registrationNumber: '821-128-821',
      name: 'space-boi',
      maxWeight: 821,
      maxPassengers: 821,
    };
    await put({
      tableName: 'spaceship',
      logDebug: jest.fn(),
      item: spaceship,
    });

    // check we called aws sdk correctly
    expect(putMock).toHaveBeenCalledWith({
      TableName: 'spaceship',
      Item: spaceship,
      ConditionExpression: undefined,
      ExpressionAttributeValues: undefined,
    });
  });
});
