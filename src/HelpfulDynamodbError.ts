export enum SimpleDynamodbOperation {
  QUERY = 'query',
  PUT = 'put',
  DELETE = 'delete',
  WRITE_TRANSACTION = 'write transaction',
}
export class HelpfulDynamodbError extends Error {
  constructor({
    operation,
    error,
    input,
  }: {
    operation: SimpleDynamodbOperation;
    error: Error;
    input: any;
  }) {
    const message = `
Error found executing dynamodb ${operation}.

Found Error:
${error.name}: ${error.message}

Input:
${JSON.stringify(input, null, 2)}
    `.trim();
    super(message);
  }
}
