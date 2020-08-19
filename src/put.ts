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
  logDebug(`${tableName}.upsert.input`, { item });
  await dynamodb.put({
    input: {
      Item: item, // the item itself
      ConditionExpression: putConditions?.ConditionExpression,
    },
  });
  logDebug(`${tableName}.upsert.output`, { success: true, item });
};
