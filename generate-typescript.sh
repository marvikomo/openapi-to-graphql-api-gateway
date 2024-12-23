#!/bin/bash

# Base configuration
GIT_HOST="github.com"
GIT_USER_ID="marvikomo"
GENERATOR_JAR="openapi-generator-cli.jar"
OUTPUT_BASE="./generated-clients"
TEMPLATE_DIR="src/code-templates/typescript-axios"
COMMON_PROPERTIES="-g typescript-axios \
                   --template-dir=${TEMPLATE_DIR} \
                   --type-mappings=decimal=Number,BigDecimal=Number,set=Array \
                   --api-package=clients \
                   --model-package=models \
                   -p sortParamsByRequiredFlag=true \
                   -p supportsES6=true \
                   -p stringEnums=true \
                   -p enumPropertyNaming=original \
                   -p platform=node \
                   -p disallowAdditionalPropertiesIfNotPresent=true \
                   -p withInterfaces=true \
                   --skip-validate-spec"

# Iterate over all YAML files in the `spec` folder
for SPEC_FILE in ./spec/*.yaml; do
  if [[ -f "$SPEC_FILE" ]]; then
    echo "Processing $SPEC_FILE"
    
    # Extract the base name of the spec file (e.g., "api-spec" from "api-spec.yaml")
    SPEC_NAME=$(basename "$SPEC_FILE" .yaml)
    
    # Generate the client output folder dynamically based on the spec name
    OUTPUT_DIR="${OUTPUT_BASE}/${SPEC_NAME}"
    
    # Run the OpenAPI generator
    java -jar ${GENERATOR_JAR} generate \
        --git-host=${GIT_HOST} \
        --git-user-id=${GIT_USER_ID} \
        -i ${SPEC_FILE} \
        -o ${OUTPUT_DIR} \
        ${COMMON_PROPERTIES} \
        -p npmName="@${GIT_USER_ID}/${SPEC_NAME}-api-client" \
        -p npmVersion="1.6.0" \
        -p npmRepository="https://github.com/${GIT_USER_ID}/artifacts" \
        -p npmSourceRepository="https://github.com/${GIT_USER_ID}/${SPEC_NAME}.git" \
        -p npmAuthor="Marvelous" \
        -p npmDescription="${SPEC_NAME} Api Client" \
        -p projectName="${SPEC_NAME}-api-client" \
        -p moduleName="${SPEC_NAME}" \
        -p npmSnapshot="$(date +%s)"
    
    # Check for errors
    if [[ $? != 0 ]]; then
      echo "Failed to generate client for ${SPEC_NAME}. Exiting."
      exit 25
    fi

    # Create the publish script for the generated client
    echo "Creating publish script for ${SPEC_NAME}"
    cat <<EOF > ${OUTPUT_DIR}/publish.sh
#!/bin/bash
cd "\$(dirname "\$0")"
echo "@${GIT_USER_ID}:registry=https://npm.pkg.github.com/${GIT_USER_ID}" > .npmrc
echo "export default {};" >> api.ts
npm install
npm publish
EOF
    chmod +x ${OUTPUT_DIR}/publish.sh
  else
    echo "No YAML files found in ./spec folder. Skipping."
  fi
done

echo "Client generation completed."