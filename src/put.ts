import { DynamoDB } from 'aws-sdk';

import { getDynamodbClient } from './getDynamodbClient/getDynamodbClient';
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
  const dynamodb = getDynamodbClient({ tableName });
  logDebug(`${tableName}.put.input`, { item, conditions: putConditions });
  await dynamodb.put({
    input: {
      Item: item, // the item itself
      ConditionExpression: putConditions?.ConditionExpression,
    },
  });
  logDebug(`${tableName}.put.output`, { success: true, item, conditions: putConditions });
};
