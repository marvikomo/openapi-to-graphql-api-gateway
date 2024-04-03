import { config } from 'dotenv';
config();

const configuration = {
  appname: 'open-api-to-graphql',
  web: {
    environment: process.env.NODE_ENV,
    port: process.env.PORT || 8787,
  },
};

export default configuration;
