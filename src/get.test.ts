import { DynamoDB } from 'aws-sdk';

import { get } from './get';

jest.mock('aws-sdk', () => {
  const putMock = jest.fn();
  const getPromiseMock = jest.fn();
  const getMock = jest
    .fn()
    .mockImplementation(() => ({ promise: getPromiseMock }));
  return {
    DynamoDB: {
      DocumentClient: jest.fn(() => ({
        put: putMock,
        get: getMock,
      })),
    },
  };
});

const getMock = new DynamoDB.DocumentClient().get as jest.Mock;
const getPromiseMock = new DynamoDB.DocumentClient().get({} as any)
  .promise as jest.Mock;

describe('get', () => {
  beforeEach(() => jest.clearAllMocks());
  it('should be possible to do a simple lookup', async () => {
    // mock the aws-sdk response items
    const exampleSavedSpaceship = {
      u: '__REG_NUMBER_FOUND__',
      registration_number: '__REG_NUMBER_FOUND__',
      name: '__NAME_FOUND__',
      max_weight: '__WEIGHT_FOUND__',
      max_passengers: '__PASSENGERS_FOUND__',
    };
    getPromiseMock.mockResolvedValueOnce({
      Item: exampleSavedSpaceship,
    });

    // init the client and run the get
    const spaceship = await get({
      tableName: 'spaceship',
      logDebug: () => {},
      key: { u: '__REG_NUMBER_FOUND__' },
      attributesToRetrieveInQuery: [
        'u',
        'registration_number',
        'name',
        'max_weight',
        'max_passengers',
      ],
    });

    // check we called aws sdk correctly
    expect(getMock).toHaveBeenCalledWith({
      TableName: 'spaceship',
      ProjectionExpression:
        '#u,#registration_number,#name,#max_weight,#max_passengers',
      ReturnConsumedCapacity: 'TOTAL',
      Key: { u: '__REG_NUMBER_FOUND__' },
      ExpressionAttributeNames: {
        // map each to ensure no naming conflicts
        '#max_passengers': 'max_passengers',
        '#max_weight': 'max_weight',
        '#name': 'name',
        '#registration_number': 'registration_number',
        '#u': 'u',
      },
    });

    // check that the returned value was accurate
    expect(spaceship).not.toEqual(null);
    expect(spaceship).toEqual(exampleSavedSpaceship);
  });
});
