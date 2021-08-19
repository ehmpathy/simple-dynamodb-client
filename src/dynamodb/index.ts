import { deleteItem } from './delete';
import { putItem } from './put';
import { getItem } from './get';
import { query } from './query';
import { transactWrite } from './transactWrite';

export const dynamodb = {
  delete: deleteItem,
  put: putItem,
  get: getItem,
  query,
  transactWrite,
};
