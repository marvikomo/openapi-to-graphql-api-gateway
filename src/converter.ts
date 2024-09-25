
 
export const  convertSchemaToTypeScript = (schema, interfaceName = 'RootObject') => {
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
  