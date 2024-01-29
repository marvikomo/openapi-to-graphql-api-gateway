import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils';
import { GraphQLSchema, defaultFieldResolver } from 'graphql';
import Helpers from '../../lib/helpers';

export function authDirective(schema: GraphQLSchema, directiveName: string) {
  return mapSchema(schema, {
    // Executes once for each object field in the schema
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      // Check whether this field has the specified directive
      const authDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
      if (authDirective) {
        // Get this field's original resolver
        const { resolve = defaultFieldResolver } = fieldConfig;
        let result = {};
        fieldConfig.resolve = async function (source, args, context, info) {
          if (Helpers.isEmptyObject(context)) {
            return Helpers.error(
              'This is an authenticated route. Authorization token must be provided'
            );
          }
          if (context && context.currentUser) {
            result = await resolve(source, args, context, info);
          }
          return result;
        };
        return fieldConfig;
      }
    },
  });
}
