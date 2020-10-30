import { DynamoDB } from 'aws-sdk';

export interface RelevantTransactWriteDeleteItemInput {
  /**
   * The primary key of the item to be deleted. Each element consists of an attribute name and a value for that attribute.
   */
  Key: DynamoDB.DocumentClient.Key;
  /**
   * Name of the table in which the item to be deleted resides.
   */
  TableName: DynamoDB.DocumentClient.TableName;
  /**
   * A condition that must be satisfied in order for a conditional delete to succeed.
   */
  ConditionExpression?: DynamoDB.DocumentClient.ConditionExpression;
  /**
   * One or more values that can be substituted in an expression.
   */
  ExpressionAttributeValues?: DynamoDB.DocumentClient.ExpressionAttributeValueMap;
}
export interface RelevantTransactWritePutItemInput {
  /**
   * A map of attribute name to attribute values, representing the primary key of the item to be written by PutItem. All of the table's primary key attributes must be specified, and their data types must match those of the table's key schema. If any attributes are present in the item that are part of an index key schema for the table, their types must match the index key schema.
   */
  Item: DynamoDB.DocumentClient.PutItemInputAttributeMap;
  /**
   * Name of the table in which to write the item.
   */
  TableName: DynamoDB.DocumentClient.TableName;
  /**
   * A condition that must be satisfied in order for a conditional update to succeed.
   */
  ConditionExpression?: DynamoDB.DocumentClient.ConditionExpression;
  /**
   * One or more values that can be substituted in an expression.
   */
  ExpressionAttributeValues?: DynamoDB.DocumentClient.ExpressionAttributeValueMap;
}

export type RelevantTransactWriteItemInput = { Put: RelevantTransactWritePutItemInput } | { Delete: RelevantTransactWriteDeleteItemInput };

export interface RelevantTransactWriteInput {
  /**
   * An ordered array of up to 25 TransactWriteItem objects, each of which contains a ConditionCheck, Put, Update, or Delete object. These can operate on items in different tables, but the tables must reside in the same AWS account and Region, and no two of them can operate on the same item.
   */
  TransactItems: RelevantTransactWriteItemInput[];

  /**
   * Determines whether consumed capacity information is returned;
   */
  ReturnConsumedCapacity?: DynamoDB.DocumentClient.ReturnConsumedCapacity;
}

export const transactWrite = async ({ input }: { input: RelevantTransactWriteInput }) => {
  const dynamodbClient = new DynamoDB.DocumentClient();
  await dynamodbClient.transactWrite(input).promise();
};
