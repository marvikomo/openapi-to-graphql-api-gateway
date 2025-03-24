import { Console } from "console"
import fs from 'fs'
import  {loadYaml, convertToOas3} from "./oas"
import { METHODS } from "http"
import path from 'path'
import * as Handlebars from 'handlebars';
import Generator from "./generator"



const convert = async () => {
    const generate = new Generator(path.join(__dirname, '../specs'), {
      /** Base output directory for all generated files */
      outputDir: '../../gen'
    })
    await generate.readFilesInDirectory();
    await generate.generateSchemaAndResolver(); 
}

convert()