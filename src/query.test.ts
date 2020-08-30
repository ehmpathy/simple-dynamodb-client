import { DynamoDB } from 'aws-sdk';
import { query } from './query';

jest.mock('aws-sdk', () => {
  const putMock = jest.fn();
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

const queryMock = new DynamoDB.DocumentClient().query as jest.Mock;
const queryPromiseMock = new DynamoDB.DocumentClient().query({} as any).promise as jest.Mock;

describe('query', () => {
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
    queryPromiseMock.mockResolvedValueOnce({
      Items: [exampleSavedSpaceship],
    });

    // init the client and run the query
    const spaceships = await query({
      tableName: 'spaceship',
      logDebug: () => {},
      queryConditions: {
        KeyConditionExpression: 'u = :registrationNumber',
        ExpressionAttributeValues: {
          ':registrationNumber': '__REGISTRATION_NUMBER__',
        },
      },
      attributesToRetrieveInQuery: ['u', 'registration_number', 'name', 'max_weight', 'max_passengers'],
    });

    // check we called aws sdk correctly
    expect(queryMock).toHaveBeenCalledWith({
      TableName: 'spaceship',
      ProjectionExpression: '#u,#registration_number,#name,#max_weight,#max_passengers',
      ReturnConsumedCapacity: 'TOTAL',
      KeyConditionExpression: 'u = :registrationNumber',
      ExpressionAttributeValues: {
        ':registrationNumber': '__REGISTRATION_NUMBER__',
      },
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
    expect(spaceships.length).toEqual(1);
    expect(spaceships[0]).toEqual(exampleSavedSpaceship);
  });
  it('should be possible to do a secondary index query', async () => {
    // mock the aws-sdk response items
    const exampleSavedSpaceship = {
      u: '__REG_NUMBER_FOUND__',
      registration_number: '__REG_NUMBER_FOUND__',
      name: '__NAME_FOUND__',
      max_weight: '__WEIGHT_FOUND__',
      max_passengers: '__PASSENGERS_FOUND__',
    };
    queryPromiseMock.mockResolvedValueOnce({
      Items: [exampleSavedSpaceship],
    });

    // init the dao and run the query
    const spaceships = await query({
      tableName: 'spaceship',
      logDebug: () => {},
      queryConditions: {
        IndexName: 'max_weight_gsi',
        KeyConditionExpression: 'max_weight > :max_weight',
        ExpressionAttributeValues: {
          ':max_weight': '800',
        },
        Limit: 10,
      },
      attributesToRetrieveInQuery: ['u', 'registration_number', 'name', 'max_weight', 'max_passengers'],
    });

    // check we called aws sdk correctly
    expect(queryMock).toHaveBeenCalledWith({
      TableName: 'spaceship',
      ProjectionExpression: '#u,#registration_number,#name,#max_weight,#max_passengers',
      ReturnConsumedCapacity: 'TOTAL',
      IndexName: 'max_weight_gsi',
      KeyConditionExpression: 'max_weight > :max_weight',
      ExpressionAttributeValues: {
        ':max_weight': '800',
      },
      ExpressionAttributeNames: {
        // map each to ensure no naming conflicts
        '#max_passengers': 'max_passengers',
        '#max_weight': 'max_weight',
        '#name': 'name',
        '#registration_number': 'registration_number',
        '#u': 'u',
      },
      Limit: 10,
    });

    // check that the returned value was accurate
    expect(spaceships.length).toEqual(1);
    expect(spaceships[0]).toEqual(exampleSavedSpaceship);
  });
});
