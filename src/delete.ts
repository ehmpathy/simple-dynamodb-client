import { DynamoDB } from 'aws-sdk';

import { dynamodb } from './dynamodb';
import { LogMethod } from './types';
import { HelpfulDynamodbError, SimpleDynamodbOperation } from './HelpfulDynamodbError';

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
  try {
    logDebug(`${tableName}.delete.input`, { tableName, key, conditions: deleteConditions });
    const response = await dynamodb.delete({
      input: {
        TableName: tableName,
        Key: key, // primary key of item to delete
        ConditionExpression: deleteConditions?.ConditionExpression,
        ExpressionAttributeValues: deleteConditions?.ExpressionAttributeValues,
      },
    });
    logDebug(`${tableName}.delete.output`, {
      success: true,
      tableName,
      key,
      conditions: deleteConditions,
      stats: {
        consumedCapacity: response.ConsumedCapacity,
      },
    });
  } catch (error) {
    throw new HelpfulDynamodbError({ operation: SimpleDynamodbOperation.DELETE, error, input: { tableName, key, deleteConditions } });
  }
};
