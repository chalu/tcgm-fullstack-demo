import fs from 'fs';
import path from 'path';
import dotenv  from "dotenv"

import * as jsyaml from 'js-yaml';
import * as OpenApiValidator from 'express-openapi-validator';

import router from './routes';
import expressapp from 'expressapp';

dotenv.config();

const ymlFilePath = path.join('src', 'api.yaml');
const ymlAsString = fs.readFileSync(ymlFilePath, 'utf8');
const apiSpecYaml = jsyaml.load(ymlAsString) as string;

const autoValidateRequestsMW = OpenApiValidator.middleware({
    apiSpec: apiSpecYaml,
    validateRequests: true, // (default)
    validateResponses: false // false by default
});

expressapp(router, autoValidateRequestsMW);
