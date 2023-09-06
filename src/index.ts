import  {loadYaml, convertToOas3} from "./oas"

const parsed = loadYaml("src/specs/test.yaml")

console.log(convertToOas3(parsed));