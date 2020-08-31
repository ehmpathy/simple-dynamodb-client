import { DynamoDB } from 'aws-sdk';

import { dynamodb } from './dynamodb';
import { LogMethod } from './types';

export interface SimpleDynamodbPutConditions {
  ConditionExpression?: DynamoDB.DocumentClient.ConditionExpression;
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
  logDebug(`${tableName}.put.input`, { item, conditions: putConditions });
  await dynamodb.put({
    input: {
      TableName: tableName,
      Item: item, // the item itself
      ConditionExpression: putConditions?.ConditionExpression,
    },
  });
  logDebug(`${tableName}.put.output`, { success: true, item, conditions: putConditions });
};
