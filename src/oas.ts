import fs, {PathOrFileDescriptor} from 'fs'
import {parse} from "yaml"
import fetch, {Response} from 'node-fetch';


export const loadYaml = (path: PathOrFileDescriptor, encoding: BufferEncoding = 'utf8') => {
    const spec = fs.readFileSync(path, encoding);
    if(!spec) throw new Error("No valid specification");
    return parse(spec);
}

const isOas2 = (specs: any) => specs.swagger && specs.swagger.startsWith('2');
const isOas3 = (specs: any) => specs.openapi && specs.openapi.startsWith('3');

const CONVERTER_URL: string = 'https://converter.swagger.io/api/convert';

export const convertToOas3 = async (specs: any): Promise<any> => {
if(isOas2(specs)){
    const response: Response = await fetch(CONVERTER_URL, {
        method: 'post',
        body: JSON.stringify(specs),
        headers: {'Content-type': 'application/json'}
    });
    
     if(response.ok) return await response.json();
    
     throw new Error("Failed to convert");
}else{
    return specs;
}

}

function validateSpec(spec: any) {
  

    
}

