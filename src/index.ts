import  {loadYaml, convertToOas3} from "./oas"


const parsed = loadYaml("src/specs/test.yaml")


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

const convert = async () => {
    let parsedRes = await convertToOas3(parsed)
    //console.log(parsedRes.paths['/onboarding/'].post.requestBody.content['application/json'].schema['$ref']);
    //console.log(parsedRes.paths['/onboarding/'].post.responses['200'].content['application/json'].schema['$ref']);
}

convert()