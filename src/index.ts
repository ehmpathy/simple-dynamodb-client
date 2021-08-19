import { del } from './delete';
import { get } from './get';
import { put } from './put';
import { query } from './query';
import { startTransaction } from './startTransaction';

export { LogMethod, AttributesToRetrieveInQuery } from './types';
export { SimpleDynamodbQueryConditions } from './query';
export { SimpleDynamodbPutConditions } from './put';
export { SimpleDynamodbDeleteConditions } from './delete';
export { SimpleDynamodbTransaction } from './startTransaction';
export { SimpleDynamodbOperation, HelpfulDynamodbError } from './HelpfulDynamodbError';

export const simpleDynamodbClient = {
  get,
  query,
  put,
  delete: del,
  startTransaction,
};
