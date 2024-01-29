import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils';
import { GraphQLSchema, defaultFieldResolver } from 'graphql';
import Helpers from '../../lib/helpers';

export function userTypeDirective(schema: GraphQLSchema, directiveName: string) {
  return mapSchema(schema, {
    // Executes once for each object field in the schema
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      // Check whether this field has the specified directive
      const userTypeDirective = getDirective(
        schema,
        fieldConfig,
        directiveName
      )?.[0];

      if (userTypeDirective) {
        // Get this field's original resolver
        const { resolve = defaultFieldResolver } = fieldConfig;
        fieldConfig.resolve = async function (source, args, context, info) {
          if (!userTypeDirective.requires.includes(context.currentUser.userType))
            return Helpers.error(
              `Unauthorized - You are unauthorized to query ${info.fieldName}`
            );
          const result = await resolve(source, args, context, info);
          return result;
        };
        return fieldConfig;
      }
    },
  });
}
