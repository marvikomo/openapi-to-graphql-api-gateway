import { Console } from "console"
import fs from 'fs'
import  {loadYaml, convertToOas3} from "./oas"
import { METHODS } from "http"
import path from 'path'
import * as Handlebars from 'handlebars';
import Generator from "./generator"



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

const getTags = (parsedSpec) => {
  return parsedSpec?.tags
}

const getPaths = (parsedSpec) => {
    return parsedSpec?.paths
}

const groupPathsByTags = (paths) => {

    const groupedByTags = []

 Object.entries(paths).forEach(([path, methods]) => {
     Object.entries(methods).forEach(([method, details]) => {
       if(details.tags) {
        details.tags.forEach((tag) => {
         if(!groupedByTags[tag]) {
            groupedByTags[tag] = {}
         }
         if(!groupedByTags[tag][path]){
            groupedByTags[tag][path] = {}
         }
         groupedByTags[tag][path][method] = details;
        })
       }
     })
   
});

return groupedByTags

 //console.log("groupByTags", groupedByTags)

}

const convertPathsToGraphQLFields = (paths) => {

}

const getQueryOutputFolder = () => {
    return path.join(__dirname, '../app/graphql/queries')
}

const createQueryFolder = (outputFolder) => {
    if(!fs.existsSync(outputFolder)){
        fs.mkdirSync(outputFolder, {recursive: true})
    }
}

const generateSchemaAndResolverFiles = (groupedByTags) => {
    const templatePath = path.join(__dirname, 'templates/schemaTemplate.handlebars');
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const template = Handlebars.compile(templateSource);

    let queries = []
    let mutations = []
    let guped =  Object.entries(groupedByTags)

    console.log("grouped", guped)

     const queryOutPutFolder = getQueryOutputFolder();
    // console.log("output...", queryOutPutFolder)
    createQueryFolder(queryOutPutFolder);


    let entries = Object.entries(groupedByTags).forEach(([tag, paths]) => {
       // console.log("path", methods)
         Object.entries(paths).forEach(([path, methods]) => {
           
            if(methods.get) {
                queries.push({name: methods.get.operationId, tag})
            }

            if(methods.post) {
                mutations.push({name: methods.post.operationId, tag})
            }
        })

         const schemaContent = template({ tag, queries, mutations });
         //console.log("queries", queries)

        // const filename = `${tag}_schema.ts`;

         const filename = path.join(queryOutPutFolder, `${tag}_schema.ts`);
         if (!fs.existsSync(filename) || fs.readFileSync(filename, 'utf8') !== schemaContent) {
            fs.writeFileSync(filename, schemaContent);
            console.log(`Generated or updated schema file: ${filename}`);
        } else {
            console.log(`No changes detected for ${filename}, skipping update.`);
        }
         queries = []
         mutations = []
       
    })

   // const schemaContent =  

   //console.log("entries", entries) 


}

const generateSchemas = (groupedByTags) => {


}


const convert = async () => {

    const generate = new Generator(path.join(__dirname, 'specs'))
    await generate.readFilesInDirectory();
    await generate.generateSchemaAndResolver();
    //console.log("ik", generate.specDirContent)
    let parsedRes = await convertToOas3(parsed)

    // console.log(parsedRes.paths)
    //let tags = getTags(parsedRes)
    // let paths = getPaths(parsedRes);
    // let  grouped = groupPathsByTags(paths);

    //generateSchemaAndResolverFiles(grouped);

    //  console.log("ForEach starts....")
    //  tags.forEach(e => {
    //     const filter = parsedRes.filter(e => e.paths)
    //     console.log(e)
        
    //  });
    // console.log(parsedRes.paths['/onboarding/'].post.requestBody.content['application/json'].schema['$ref']);
    // console.log(parsedRes.paths['/onboarding/'].post.responses['200'].content['application/json'].schema['$ref']);
}

convert()