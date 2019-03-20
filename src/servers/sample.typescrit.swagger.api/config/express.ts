import { Application } from 'express';
import * as express from "express";
import container from './di';
import * as bodyParser from 'body-parser';
import config from './env';
import { useServiceUser } from '../../../modules/users/index';
import { useAuth } from '../../../modules/auth/index';
const cors = require('cors');

import * as swagger from "swagger-express-ts";
import { SwaggerDefinitionConstant } from "swagger-express-ts";

export function configureExpress(app: Application) {

    app.use('/api-docs/swagger', express.static('swagger'));
    app.use('/api-docs/swagger/assets', express.static('node_modules/swagger-ui-dist'));

    app.use(swagger.express(
        {
            definition: {
                info: {
                    title: "My api",
                    version: "1.0"
                },
                externalDocs: {
                    url: `http://localhost:${config.port}`
                },
                securityDefinitions: {
                    apiKeyHeader: {
                        type: SwaggerDefinitionConstant.Security.Type.API_KEY,
                        in: SwaggerDefinitionConstant.Security.In.HEADER,
                        name: 'Bearer Token',
                    }
                }
                // Models can be defined here
            }
        }
    ));

    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

    // disable 'X-Powered-By' header in response
    app.disable('x-powered-by');

    // enable CORS - Cross Origin Resource Sharing
    app.use(cors());

    app.set('superSecret', config.secret); // secret variable

    useAuth(app, container);
    useServiceUser(app, container);
}