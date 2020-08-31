import { deleteItem } from './delete';
import { putItem } from './put';
import { query } from './query';
import { transactWrite } from './transactWrite';

export const dynamodb = {
  delete: deleteItem,
  put: putItem,
  query,
  transactWrite,
};
