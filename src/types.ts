export type LogMethod = (message: string, metadata: any) => void;

/**
 * An array of strings containing the list of attributes to retrieve from the table.
 *
 * For example, const `name,age,height` will return objects with the shape `{ name, age, height }`
 *
 * Amazon defines this property as the "ProjectionExpression" in their docs:
 * > A string that identifies one or more attributes to retrieve from the table. These attributes can include scalars, sets, or elements of a JSON document. The attributes in the expression must be separated by commas. If no attribute names are specified, then all attributes will be returned. If any of the requested attributes are not found, they will not appear in the result. For more information, see Accessing Item Attributes in the Amazon DynamoDB Developer Guide.
 *
 * The `query` method normalizes both these keys and the query inputs with a `#` to ensure that no collisions occur - abstracting that step away from the user completely.
 */
export type AttributesToRetrieveInQuery = string[];
