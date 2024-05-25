import { deleteItem } from './delete';
import { getItem } from './get';
import { putItem } from './put';
import { query } from './query';
import { transactWrite } from './transactWrite';

export const dynamodb = {
  delete: deleteItem,
  put: putItem,
  get: getItem,
  query,
  transactWrite,
};
