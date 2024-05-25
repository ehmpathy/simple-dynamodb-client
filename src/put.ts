import { DynamoDB } from 'aws-sdk';

import {
  HelpfulDynamodbError,
  SimpleDynamodbOperation,
} from './HelpfulDynamodbError';
import { dynamodb } from './dynamodb';
import { LogMethod } from './types';

export interface SimpleDynamodbPutConditions {
  ConditionExpression?: DynamoDB.DocumentClient.PutItemInput['ConditionExpression'];
  ExpressionAttributeValues?: DynamoDB.DocumentClient.PutItemInput['ExpressionAttributeValues'];
}

export const put = async ({
  tableName,
  logDebug,
  item,
  putConditions,
}: {
  tableName: string;
  logDebug: LogMethod;
  item: object;
  putConditions?: SimpleDynamodbPutConditions;
}) => {
  try {
    logDebug(`${tableName}.put.input`, {
      tableName,
      item,
      conditions: putConditions,
    });
    const response = await dynamodb.put({
      input: {
        TableName: tableName,
        Item: item, // the item itself
        ConditionExpression: putConditions?.ConditionExpression,
        ExpressionAttributeValues: putConditions?.ExpressionAttributeValues,
      },
    });
    logDebug(`${tableName}.put.output`, {
      success: true,
      tableName,
      item,
      conditions: putConditions,
      stats: {
        consumedCapacity: response.ConsumedCapacity,
      },
    });
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    throw new HelpfulDynamodbError({
      operation: SimpleDynamodbOperation.PUT,
      error,
      input: { tableName, item, putConditions },
    }); // make error more helpful when thrown
  }
};
