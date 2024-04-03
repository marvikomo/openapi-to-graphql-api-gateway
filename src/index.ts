import  {loadYaml, convertToOas3} from "./oas"


import  {createGraphQLSchema } from "openapi-to-graphql"

// load or construct OAS (const oas = ...)
type Oas3 = {
    openapi: string,
    [key: string]: any
}



const createSchema = async () => {

    const parsed = loadYaml("src/specs/test.yaml")
    const openapi: any =  await convertToOas3(parsed)
   // console.log(openapi);

    const { schema, report } = await createGraphQLSchema(openapi);
    console.log("here", schema)
}


createSchema()