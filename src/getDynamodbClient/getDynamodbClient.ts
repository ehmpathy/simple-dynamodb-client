import { DynamoDB } from 'aws-sdk';

import { put, RelevantPutInput } from './put';
import { query, RelevantQueryInput } from './query';

export interface DynamodbClient {
  put: (args: { input: RelevantPutInput }) => Promise<void>;
  query: (args: { input: RelevantQueryInput }) => Promise<DynamoDB.DocumentClient.QueryOutput>;
}

/**
 * initializes the client with table name
 */
export const getDynamodbClient = ({ tableName }: { tableName: string }): DynamodbClient => {
  const dynamodbClient = new DynamoDB.DocumentClient();
  return {
    put: async ({ input }: { input: RelevantPutInput }) => put({ dynamodbClient, tableName, input }),
    query: async ({ input }: { input: RelevantQueryInput }) => query({ dynamodbClient, tableName, input }),
  };
};
