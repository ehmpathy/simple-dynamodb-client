import { DynamoDB } from 'aws-sdk';
import https from 'https';

// define an http agent which keeps the connections alive per aws example: https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/node-reusing-connections.html
const agent = new https.Agent({
  keepAlive: true,
});

// cache the client globally in memory; client reuse is a best practice
let cachedDocumentClient: DynamoDB.DocumentClient | null = null;

/**
 * fetches a document client with best practices:
 * - share the client for all requests made in the same execution context
 *   - i.e., the client is cached in memory after first creation
 *   - https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Streams.Lambda.BestPracticesWithDynamoDB.html
 * - reuse tcp connections
 *   - https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/node-reusing-connections.html
 *   - > By default, the default Node.js HTTP/HTTPS agent creates a new TCP connection for every new request. To avoid the cost of establishing a new connection, you can reuse an existing connection.
 *   - > For short-lived operations, such as DynamoDB queries, the latency overhead of setting up a TCP connection might be greater than the operation itself. Additionally, since DynamoDB encryption at rest is integrated with AWS KMS, you may experience latencies from the database having to re-establish new AWS KMS cache entries for each operation.
 *   - we've seen duration drop from 40ms to 5ms just from this change on high volume queries/gets
 */
export const getDocumentClient = () => {
  if (cachedDocumentClient) return cachedDocumentClient;
  const documentClient = new DynamoDB.DocumentClient({
    httpOptions: { agent },
    endpoint: process.env.USE_CUSTOM_DYNAMODB_ENDPOINT, // enable user specifying a custom endpoint, for example if they want to use dynamodb local
  });
  cachedDocumentClient = documentClient;
  return documentClient;
};
