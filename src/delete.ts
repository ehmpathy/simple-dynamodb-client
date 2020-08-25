import { DynamoDB } from 'aws-sdk';

import { getDynamodbClient } from './getDynamodbClient/getDynamodbClient';
import { LogMethod } from './types';

export interface SimpleDynamodbDeleteConditions {
  ConditionExpression?: DynamoDB.DocumentClient.ConditionExpression;
}

// note: we use the name "del" here because "delete" is a reserved keyword
export const del = async ({
  tableName,
  logDebug,
  key,
  deleteConditions,
}: {
  tableName: string;
  logDebug: LogMethod;
  key: DynamoDB.DocumentClient.Key;
  deleteConditions?: SimpleDynamodbDeleteConditions;
}) => {
  const dynamodb = getDynamodbClient({ tableName });
  logDebug(`${tableName}.delete.input`, { key, conditions: deleteConditions });
  await dynamodb.delete({
    input: {
      Key: key, // primary key of item to delete
      ConditionExpression: deleteConditions?.ConditionExpression,
    },
  });
  logDebug(`${tableName}.delete.output`, { success: true, key, conditions: deleteConditions });
};
