# OpenAPI to GraphQL API Gateway

## Overview

The **OpenAPI to GraphQL API Gateway** is a tool designed to convert OpenAPI specifications into a GraphQL-based API. 
It serves as an intermediary gateway, transforming GraphQL queries and mutations into RESTful API calls defined in OpenAPI specs, 
and vice versa. This project simplifies the process of adopting GraphQL for existing REST APIs without the need for a complete backend rewrite.

---

## Features

- **Automatic GraphQL Schema Generation**:
  - Converts OpenAPI specs into GraphQL schemas.
  - Automatically generates queries and resolvers using templates.
- **Seamless Integration**:
  - Acts as an API Gateway, bridging GraphQL clients with REST APIs.
- **Customizable Templates**:
  - Modify query and resolver templates for tailored GraphQL generation.
- **Logging and Monitoring**:
  - Built-in logging for better debugging and observability.
- **Scalable**:
  - Supports multiple OpenAPI specifications.

---

## Installation

### Prerequisites
- **Node.js** (v16 or later)
- **Yarn** or **npm**
- OpenAPI specification file (YAML or JSON)

### Clone the Repository
```bash
git clone https://github.com/marvikomo/openapi-to-graphql-api-gateway.git
cd openapi-to-graphql-api-gateway
