import fs from 'fs';
import path from 'path';
import dotenv from "dotenv"

import * as jsyaml from 'js-yaml';
import rateLimit from 'express-rate-limit'
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
    validateResponses: true // false by default
});

const rateLimiter = rateLimit({
    windowMs: 1000,         // 1 second
    max: 1,                 // Limit each IP to 1 request per `window`
    standardHeaders: true,  // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false    // Disable the `X-RateLimit-*` headers
})

expressapp(router, [...autoValidateRequestsMW, rateLimiter]);
