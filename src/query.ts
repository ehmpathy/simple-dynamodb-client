import { ConsistentRead, IndexName, Key, KeyExpression, PositiveIntegerObject } from 'aws-sdk/clients/dynamodb';

import { getDynamodbClient } from './getDynamodbClient/getDynamodbClient';
import { AttributesToRetrieveInQuery, LogMethod } from './types';

/**
 * A subset of the DynamoDB.DocumentClient.QueryInput interface.
 *
 * This set of keys removes the "legacy" keys, the keys that are already defined for you by this dao (e.g., TableName), and keys that may lead to shooting yourself in the foot (e.g., FilterExpression)
 */
export interface SimpleDynamodbQueryConditions {
  /**
   * The name of an index to query. This index can be any local secondary index or global secondary index on the table.
   */
  IndexName?: IndexName;
  /**
   * The maximum number of items to evaluate (not necessarily the number of matching items). If DynamoDB processes the number of items up to the limit while processing the results, it stops the operation and returns the matching values up to that point, and a key in LastEvaluatedKey to apply in a subsequent operation, so that you can pick up where you left off. Also, if the processed data set size exceeds 1 MB before DynamoDB reaches this limit, it stops the operation and returns the matching values up to the limit, and a key in LastEvaluatedKey to apply in a subsequent operation to continue the operation. For more information, see Query and Scan in the Amazon DynamoDB Developer Guide.
   */
  Limit?: PositiveIntegerObject;
  /**
   * Determines the read consistency model: If set to true, then the operation uses strongly consistent reads; otherwise, the operation uses eventually consistent reads. Strongly consistent reads are not supported on global secondary indexes. If you query a global secondary index with ConsistentRead set to true, you will receive a ValidationException.
   */
  ConsistentRead?: ConsistentRead;
  /**
   * Specifies the order for index traversal: If true (default), the traversal is performed in ascending order; if false, the traversal is performed in descending order.  Items with the same partition key value are stored in sorted order by sort key. If the sort key data type is Number, the results are stored in numeric order. For type String, the results are stored in order of UTF-8 bytes. For type Binary, DynamoDB treats each byte of the binary data as unsigned. If ScanIndexForward is true, DynamoDB returns the results in the order in which they are stored (by sort key value). This is the default behavior. If ScanIndexForward is false, DynamoDB reads the results in reverse order by sort key value, and then returns the results to the client.
   */
  ScanIndexForward?: boolean;
  /**
   * The primary key of the first item that this operation will evaluate. Use the value that was returned for LastEvaluatedKey in the previous operation. The data type for ExclusiveStartKey must be String, Number or Binary. No set data types are allowed.
   */
  ExclusiveStartKey?: Key;
  /**
   * The condition that specifies the key value(s) for items to be retrieved by the Query action. The condition must perform an equality test on a single partition key value. The condition can optionally perform one of several comparison tests on a single sort key value. This allows Query to retrieve one item with a given partition key value and sort key value, or several items that have the same partition key value but different sort key values. The partition key equality test is required, and must be specified in the following format:  partitionKeyName = :partitionkeyval  If you also want to provide a condition for the sort key, it must be combined using AND with the condition for the sort key. Following is an example, using the = comparison operator for the sort key:  partitionKeyName = :partitionkeyval AND sortKeyName = :sortkeyval  Valid comparisons for the sort key condition are as follows:    sortKeyName = :sortkeyval - true if the sort key value is equal to :sortkeyval.    sortKeyName &lt; :sortkeyval - true if the sort key value is less than :sortkeyval.    sortKeyName &lt;= :sortkeyval - true if the sort key value is less than or equal to :sortkeyval.    sortKeyName &gt; :sortkeyval - true if the sort key value is greater than :sortkeyval.    sortKeyName &gt;=  :sortkeyval - true if the sort key value is greater than or equal to :sortkeyval.    sortKeyName BETWEEN :sortkeyval1 AND :sortkeyval2 - true if the sort key value is greater than or equal to :sortkeyval1, and less than or equal to :sortkeyval2.    begins_with ( sortKeyName, :sortkeyval ) - true if the sort key value begins with a particular operand. (You cannot use this function with a sort key that is of type Number.) Note that the function name begins_with is case-sensitive.   Use the ExpressionAttributeValues parameter to replace tokens such as :partitionval and :sortval with actual values at runtime. You can optionally use the ExpressionAttributeNames parameter to replace the names of the partition key and sort key with placeholder tokens. This option might be necessary if an attribute name conflicts with a DynamoDB reserved word. For example, the following KeyConditionExpression parameter causes an error because Size is a reserved word:    Size = :myval    To work around this, define a placeholder (such a #S) to represent the attribute name Size. KeyConditionExpression then is as follows:    #S = :myval    For a list of reserved words, see Reserved Words in the Amazon DynamoDB Developer Guide. For more information on ExpressionAttributeNames and ExpressionAttributeValues, see Using Placeholders for Attribute Names and Values in the Amazon DynamoDB Developer Guide.
   */
  KeyConditionExpression?: KeyExpression;
  /**
   * One or more values that can be substituted in an expression. Use the : (colon) character in an expression to dereference an attribute value. For example, suppose that you wanted to check whether the value of the ProductStatus attribute was one of the following:   Available | Backordered | Discontinued  You would first need to specify ExpressionAttributeValues as follows:  { ":avail": "Available", ":back": "Backordered", ":disc": "Discontinued" }  You could then use these values in an expression, such as this:  ProductStatus IN (:avail, :back, :disc)  For more information on expression attribute values, see Specifying Conditions in the Amazon DynamoDB Developer Guide.
   */
  ExpressionAttributeValues?: { [index: string]: string | number | boolean | null };
}

export const query = async ({
  tableName,
  logDebug,
  attributesToRetrieveInQuery,
  queryConditions,
}: {
  tableName: string;
  attributesToRetrieveInQuery: AttributesToRetrieveInQuery;
  queryConditions: SimpleDynamodbQueryConditions;
  logDebug: LogMethod;
}): Promise<object[]> => {
  // 0. prefix all "attributesToRetrieveInQueries" with "#" to ensure no collisions exist and build up name mapping map
  const prefixedAttributesToRetrieveInQueries = attributesToRetrieveInQuery.map((attr) => `#${attr}`).join(',');
  const attributesToPrefixedAttributesMap = attributesToRetrieveInQuery.reduce(
    (map, thisAttr) => ({ ...map, [`#${thisAttr}`]: thisAttr }),
    {} as { [index: string]: string },
  );

  // 1. execute the query, log params and output
  logDebug(`${tableName}.query.input`, { queryConditions });
  const dynamodb = getDynamodbClient({ tableName });
  const result = await dynamodb.query({
    input: {
      ...queryConditions, // user defined conditions
      ProjectionExpression: prefixedAttributesToRetrieveInQueries, // plus the prefixed projection expression
      ExpressionAttributeNames: attributesToPrefixedAttributesMap, // plus the map to ensure no reserved keyword collisions from dynamo
    },
  });
  logDebug(`${tableName}.query.output`, {
    queryConditions,
    stats: {
      itemCount: result.Count,
      scannedCount: result.ScannedCount, // this will always be equal to item count, as we don't allow filtering as an input
      consumedCapacity: result.ConsumedCapacity,
      lastEvaluatedKey: result.LastEvaluatedKey,
    },
  });

  // 2. cast from database objects into service layer objects
  const databaseObjects = result.Items ?? [];
  return databaseObjects;
};
