import  {loadYaml, convertToOas3} from "./oas"
import * as SwaggerParser from 'swagger-parser';
import OpenAPIParser  from '@readme/openapi-parser';


import OASNormalize from 'oas-normalize';

//const parsed = loadYaml("src/specs/test.yaml")


//First, read the tags
// tags: [
//     {
//       name: 'onboarding',
//       description: 'User onboarding related endpoints'
//     },
//     { name: 'auth', description: 'auth related endpoints' },
//     { name: 'cart', description: 'cart related endpoints' },
//     { name: 'booking', description: 'booking related endpoints' },
//     { name: 'category', description: 'category related endpoints' },
//     { name: 'product', description: 'Product related endpoints' }
//   ],
//use it to create different folders under queries
//Then build the schema
//Filter the path into tags. we will have like array 
//For the schema, load the path.  for each path do a conditional check if post and get or put and delete
//if(method === 'get)
// {
//     queries[operation.operationId] = {
//         requestType: '#/components/schemas/UserSignup',
//         responseType: ''#/components/schemas/SignupResponse''

//     }
// }
//same for Post
//Use it to generate the schema

//TODO format operationId to be unique
const convert = async () => {

  const parsedSpec = loadYaml( "src/specs/test2.yaml")
  const cov = await convertToOas3(parsedSpec)

  console.log("cov", cov.paths['/product'].get)
  

    const oas1 = new OASNormalize(
        "src/specs/test2.yaml",
        { enablePaths: true }
        // ...or a string, path, JSON blob, whatever you've got.
      );

    //   const oas2 = new OASNormalize(
    //     "src/specs/test2.yaml",
    //     { enablePaths: true }
    //     // ...or a string, path, JSON blob, whatever you've got.
    //   );
    const api: any = await oas1.deref();


    console.log("normalized", api.paths['/product'].get)
    return
   // const ap2 = await oas2.deref();
    //console.log("API", api)
    //Path to Response
    let schema = api.paths['/product'].get.responses['200']?.content['application/json'].schema


    console.log("schema", schema)
    console.log(JSON.stringify(schema))
    const typeScriptDefinition = convertSchemaToTypeScript(schema);
     console.log(typeScriptDefinition);

  //Path to parameters

  let parameters = api.paths['/product'].post.parameters

  console.log("parameters", parameters)

  const resolve = resolveParametersSchemaToType(parameters)

  console.log("resolved", resolve)


  let request = api.paths['/product'].post.requestBody.content['application/json']

  console.log("request schema", JSON.stringify(request))

  const requestDefinition = convertSchemaToTypeScript(request.schema);

  console.log("request", requestDefinition)
  

    //let result = convertSchemaToTypeScript(schema)
   // console.log(result)
   // console.log(JSON.stringify(schema.properties));




   // console.log("API2", ap2)
  //  let parsedRes = await convertToOas3(parsed)
    //console.log(parsedRes.paths['/onboarding/'].post.requestBody.content['application/json'].schema['$ref']);
    //console.log(parsedRes.paths['/onboarding/'].post.responses['200'].content['application/json'].schema['$ref']);
}

function resolveParametersSchemaToType(parameters) {
  let queryInterface = 'interface QueryParams {\n';
  let pathInterface = 'interface PathParams {\n';
  
  parameters.forEach(param => {
    const typeName = convertSchemaToType(param.schema);
    const optional = param.required ? '' : '?';
    const paramString = `  ${param.name}${optional}: ${typeName};\n`;
    
    if (param.in === 'query') {
      queryInterface += paramString;
    } else if (param.in === 'path') {
      pathInterface += paramString;
    }
  });
  
  queryInterface += '}\n\n';
  pathInterface += '}\n';
  
  return queryInterface + pathInterface;

}

function convertSchemaToType(schema) {
  if (schema.type === 'integer') {
    return 'number';
  } else if (schema.type === 'string') {
    return 'string';
  } else if (schema.type === 'array') {
    return 'any[]'; // We don't have enough information about the array items
  }
  return 'any'; // Default to 'any' for unknown types
}





function convertSchemaToTypeScript(schema, interfaceName = 'RootObject') {
  let output = '';
  const interfaces = new Set();

  function processProperty(prop, propName) {
    if (prop.type === 'object' && prop.properties) {
      const subInterfaceName = propName.charAt(0).toUpperCase() + propName.slice(1);
      let subInterface = `interface ${subInterfaceName} {\n`;
      for (const [key, value] of Object.entries(prop.properties)) {
        subInterface += `  ${key}: ${getType(value, key)};\n`;
      }
      subInterface += '}\n\n';
      interfaces.add(subInterface);
      return subInterfaceName;
    } else if (prop.type === 'array') {
      if (prop.items && prop.items.type === 'array') {
        return `${processProperty(prop.items, propName)}[]`;
      }
      return `${processProperty(prop.items, propName)}[]`;
    } else {
      return getType(prop);
    }
  }

  function getType(prop, propName = '') {
    switch (prop.type) {
      case 'string':
        return 'string';
      case 'number':
        return 'number';
      case 'integer':
        return 'number'; // TypeScript doesn't have a separate 'integer' type
      case 'boolean':
        return 'boolean';
      case 'array':
        return `${getType(prop.items, propName)}[]`;
      case 'object':
        return processProperty(prop, propName);
      default:
        return 'any';
    }
  }

  if (schema.type === 'object' && schema.properties) {
    output += `interface ${interfaceName} {\n`;
    for (const [key, value] of Object.entries(schema.properties)) {
      output += `  ${key}: ${processProperty(value, key)};\n`;
    }
    output += '}\n\n';
  } else if (schema.type === 'array') {
    const itemType = processProperty(schema.items, 'Item');
    output += `type ${interfaceName} = ${itemType}[];\n\n`;
  } else {
    output += `type ${interfaceName} = ${getType(schema)};\n\n`;
  }

  return Array.from(interfaces).join('') + output;
}


convert()


const schema1 = {
  type: "object",
  properties: {
    productitems: {
      type: "array",
      items: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: {
              type: "string"
            },
            cuteName: {
              type: "string"
            },
            cuteBrand: {
              type: "string"
            },
            price: {
              type: "number"
            },
            otherItems: {
              type: "object",
              properties: {
                id: {
                  type: "string"
                },
                name: {
                  type: "string"
                }
              }
            }
          }
        }
      }
    },
    productArray: {
      type: "array",
      items: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: {
              type: "string"
            },
            cuteName: {
              type: "string"
            },
            cuteBrand: {
              type: "string"
            },
            price: {
              type: "number"
            },
            otherItems: {
              type: "object",
              properties: {
                id: {
                  type: "string"
                },
                name: {
                  type: "string"
                }
              }
            }
          }
        }
      }
    },
    total: {
      type: "integer"
    },
    products: {
      type: "object",
      properties: {
        id: {
          type: "string"
        },
        cuteName: {
          type: "string"
        },
        cuteBrand: {
          type: "string"
        },
        price: {
          type: "number"
        },
        otherItems: {
          type: "object",
          properties: {
            id: {
              type: "string"
            },
            name: {
              type: "string"
            }
          }
        }
      }
    }
  }
};



const schema2 = {
  type: "array",
  items: {
    type: "object",
    properties: {
      id: {
        type: "string"
      },
      cuteName: {
        type: "string"
      },
      cuteBrand: {
        type: "string"
      },
      price: {
        type: "number"
      },
      otherItems: {
        type: "object",
        properties: {
          id: {
            type: "string"
          },
          name: {
            type: "string"
          }
        }
      }
    }
  }
};