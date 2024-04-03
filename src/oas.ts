import fs, {PathOrFileDescriptor} from 'fs'
import {parse} from "yaml"
import {convertObj} from 'swagger2openapi';
import validator from 'ibm-openapi-validator';


type Oas2 = {
    swagger: string,
    [key: string]: any
}

type Oas3 = {
    openapi: string,
    [key: string]: any
}
export const loadYaml = (path: PathOrFileDescriptor, encoding: BufferEncoding = 'utf8') => {
    const spec = fs.readFileSync(path, encoding);
    if(!spec) throw new Error("No valid specification");
    return parse(spec);
}

const isOas2 = (specs: any) => specs.swagger && specs.swagger.startsWith('2');
const isOas3 = (specs: any) => specs.openapi && specs.openapi.startsWith('3');


export const convertToOas3 = async (specs: any): Promise<Oas3> => {
    try{
       const {openapi} =  await convertObj(specs, {});
       return openapi;
    }catch(err: any) {
        throw new Error(`could not convert swagger to openapi - ${err.message}`)
    }
}

const validateOas = async (specs: Oas2 | Oas3): Promise<any> => {
    return await validator(specs);
}

//return oas3 validated specs
const validatedSpecs = async (specs: any) => {
    try{
        if(isOas2(specs)) {
          return await convertToOas3(specs);
        }else if(isOas3(specs)) {
            let result = await validateOas(specs);
            console.log("result", result)
        }
    }catch(err) {
      
    }
}

