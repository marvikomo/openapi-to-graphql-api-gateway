import fs from 'fs'

export const createFolder = (outputFolder) => {
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true })
  }
}

export const readFile = (path) => {
  return fs.readFileSync(path, 'utf8')
}

export const writeFile = (path, content) => {
  return  fs.writeFileSync(path, content);

}
export const checkIfFileExists = (path) => {
  return fs.existsSync(path)
}


export const toPascalCase = (str: string) => {
  // Convert the string to camelCase first
  let camelCaseStr = str
    .replace(/[^a-zA-Z0-9]+/g, ' ') // Remove all non-word characters
    .trim() // Remove leading and trailing whitespace
    .toLowerCase() // Convert the string to lowercase
    .replace(/\s+(.)/g, (match, group1) => group1.toUpperCase()) // Convert to camelCase

  // Capitalize the first letter of the resulting camelCase string
  return camelCaseStr.charAt(0).toUpperCase() + camelCaseStr.slice(1)
}

export const toCamelCase = (str: string) => {
  return str
      // Remove all non-word characters (anything except numbers and letters)
      .replace(/[^a-zA-Z0-9]+/g, ' ')
      // Remove any leading or trailing whitespace
      .trim()
      // Lowercase the whole string first
      .toLowerCase()
      // Replace the first character of each word except the first word
      // with its upper case letter
      .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
          if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
          return index === 0 ? match.toLowerCase() : match.toUpperCase();
      });
}

export const removeServiceSuffix = (str) =>{
  // Use a regular expression to remove any non-word characters followed by 'service'
  // from the end of the string. The 'i' flag makes the operation case-insensitive.
  return str.replace(/[\W_]*service$/i, '');
}
