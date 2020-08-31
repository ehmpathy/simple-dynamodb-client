import { DynamoDB } from 'aws-sdk';

export interface RelevantDeleteInput {
  /**
   * The name of the table from which to delete the item.
   */
  TableName: DynamoDB.DocumentClient.TableName;
  /**
   * A map of attribute names to AttributeValue objects, representing the primary key of the item to delete. For the primary key, you must provide all of the attributes. For example, with a simple primary key, you only need to provide a value for the partition key. For a composite primary key, you must provide values for both the partition key and the sort key.
   */
  Key: DynamoDB.DocumentClient.Key;
  /**
   * A condition that must be satisfied in order for a conditional DeleteItem to succeed. An expression can contain any of the following:   Functions: attribute_exists | attribute_not_exists | attribute_type | contains | begins_with | size  These function names are case-sensitive.   Comparison operators: = | &lt;&gt; | &lt; | &gt; | &lt;= | &gt;= | BETWEEN | IN      Logical operators: AND | OR | NOT    For more information about condition expressions, see Condition Expressions in the Amazon DynamoDB Developer Guide.
   */
  ConditionExpression?: DynamoDB.DocumentClient.ConditionExpression;
}

export const deleteItem = async ({ input }: { input: RelevantDeleteInput }) => {
  const dynamodbClient = new DynamoDB.DocumentClient();
  await dynamodbClient.delete(input).promise();
};
