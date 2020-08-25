import { DynamoDB } from 'aws-sdk';

export interface RelevantPutInput {
  Item: DynamoDB.DocumentClient.PutItemInputAttributeMap;
  ConditionExpression?: DynamoDB.DocumentClient.ConditionExpression;
}

export const putItem = async ({
  dynamodbClient,
  tableName,
  input,
}: {
  dynamodbClient: DynamoDB.DocumentClient;
  tableName: string;
  input: RelevantPutInput;
}) => {
  await dynamodbClient
    .put({
      // into table
      TableName: tableName,

      // item, conditions, etc
      ...input,
    })
    .promise();
};
