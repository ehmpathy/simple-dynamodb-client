import { DynamoDB } from 'aws-sdk';

import { dynamodb } from './dynamodb';
import { LogMethod } from './types';

export interface SimpleDynamodbDeleteConditions {
  ConditionExpression?: DynamoDB.DocumentClient.DeleteItemInput['ConditionExpression'];
  ExpressionAttributeValues?: DynamoDB.DocumentClient.DeleteItemInput['ExpressionAttributeValues'];
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
  logDebug(`${tableName}.delete.input`, { key, conditions: deleteConditions });
  await dynamodb.delete({
    input: {
      TableName: tableName,
      Key: key, // primary key of item to delete
      ConditionExpression: deleteConditions?.ConditionExpression,
      ExpressionAttributeValues: deleteConditions?.ExpressionAttributeValues,
    },
  });
  logDebug(`${tableName}.delete.output`, { success: true, key, conditions: deleteConditions });
};
