# simple-dynamodb-client

![ci_on_commit](https://github.com/uladkasach/simple-dynamodb-client/workflows/ci_on_commit/badge.svg)
![deploy_on_tag](https://github.com/uladkasach/simple-dynamodb-client/workflows/deploy_on_tag/badge.svg)

A simple, convenient interface for interacting with dynamodb with best practices.

Simple:

- removes "deprecated" and redundant params
- adds intellisense comments to type definitions on params
- normalizes input keys to ensure that no reserved key errors are thrown from dynamo api

Best practices:

- enforces standard input and output logging, which is important for debugging live systems

# Install

```sh
npm install --save simple-dynamodb-client
```

# Example

### write

```ts
import { simpleDynamodbClient } from 'simple-dynamodb-client';

// ... your other imports ...

export const record = async ({ user }: { user: User }) => {
  const config = await promiseConfig();
  const item = castFromModelToDynamodbItem({ user });
  await simpleDynamodbClient.put({
    tableName: config.dynamodb.userTable,
    logDebug: log.debug,
    item,
  });
};
```

### read

```ts
import { simpleDynamodbClient } from 'simple-dynamodb-client';

// ... your other imports ...

export const findByUuid = async ({ uuid }: { uuid: string }) => {
  const config = await promiseConfig();
  const items = await simpleDynamodbClient.query({
    tableName: config.dynamodb.userTable,
    logDebug: log.debug,
    attributesToRetrieveInQuery: ['user'], // i.e., we only care about the "user" key, in this example
    queryConditions: {
      KeyConditionExpression: 'p = :p',
      ExpressionAttributeValues: {
        ':p': uuid, // ui.e., uid is the partition key, in this example
      },
    },
  });
  if (!items.length) return null;
  if (items.length > 1) throw new Error('more than one user found by uuid');
  return castFromDynamodbItemToModel({ item: items[0] });
};
```

# Tips

## terraform

we recommend provisioning your dynamodb tables with terraform. example:

```hcl
resource "aws_dynamodb_table" "table_user" {
  name = "${local.service}-table-user-${var.environment}"

  billing_mode = "PAY_PER_REQUEST"

  hash_key = "p" # partition key

  attribute {
    name = "p"
    type = "S"
  }

  tags = local.tags
}
```

## casting

we recommend defining explicit casting functions (as you will have seen in the examples above).

a `getPartitionKey` is a useful function because it explicitly declares how to get the partition key in one place:

```ts
export const getPartitionKey = ({ user }: { user: User }) => user.uuid`;
```

a `castFromModelToDynamodbItem` function allows you to declare in one place how to cast from the way your code talks about this data into the way that dynamo will represent the data:

```ts
import { getPartitionKey } from './getPartitionKey';

export const castFromModelToDynamodbItem = ({ user }: { user: User }) => {
  return {
    p: getPartitionKey({ user }), // the partition key, upon which we will overwrite data
    recorded_at: new Date().toISOString(), // for debugging the last time cache for this was updated
    user, // i.e., just store the whole object in one column, for simplicity
    user_name: user.name, // but also store the users name in a separate column for easier visual debugging
  };
};
```

and a `castFromDynamodbItemToModel` function allows you to declare in one place how to do the reverse, and cast from the way that dynamodb talks about your data back to how your code prefers to talk about it:

```ts
export const castFromDynamodbItemToModel = ({ item }: { item: any }) => {
  return new User(item.user); // we expect that the whole "user" object is stored on `item.user`; this is reflected in the `castFromModelToDynamodbItem` function
};
```
