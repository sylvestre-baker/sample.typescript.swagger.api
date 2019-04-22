import { httpGet, httpPost, controller } from 'inversify-express-utils';
import { injectable, inject } from 'inversify';
import { validateBody, validateQuery, authorize, authorizeAdmin } from '../../../modules/common';

import { Request, Response, NextFunction } from 'express';

import { TYPES } from '../../../modules/common/';

import * as jwt from 'jsonwebtoken';
import config from '../config/env';
import * as appInsights from 'applicationinsights';
import { ApiPath, ApiOperationPost, ApiOperationPut, ApiOperationDelete, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { ServiceGodfather, AddGodchildToGodfatherRequest, GodchildResponse } from '../../../modules/godfathers/index';

@ApiPath({
    path: "/godfather",
    name: "Godfather",
    security: { apiKeyHeader: [] }
})
@injectable()
@controller('/godfather', authorize())
export class ControllerGodfather {
    constructor(
        @inject(TYPES.ServiceGodfather) private serviceGodfather: ServiceGodfather,

    ) { }
    @ApiOperationPost({
        path: '/add/godchild',
        description: "Add godchild by userId",
        summary: "Add godchild by userId",
        parameters: {
            body: { description: "Add godchild by userId", required: true, model: "AddGodchildToGodfatherRequest" }
        },

        responses: {
            200: { model: "GodchildResponse" },
            400: { model: "GodchildResponse" }
        },
        security: { apiKeyHeader: [] }
    })

    @httpPost('/add/godchild', validateBody(AddGodchildToGodfatherRequest))
    public async addGodchild(req: Request, res: Response) {
        appInsights.defaultClient.trackNodeHttpRequest({ request: req, response: res });
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, config.secret);
            if (decodedToken.userId != req.body.userId) {
                const resp = new GodchildResponse();
                resp.message = `User with this id ${req.body.userId} is not allowed`;
                resp.success = false;
                resp.godchild = null;
                res.status(400).send(resp);
            }
            else {
                const resp = await this.serviceGodfather.addGodchild(req.body);
                if (!resp) {
                    const resp = new GodchildResponse();
                    resp.message = 'BAD REQUEST';
                    resp.success = false;
                    resp.godchild = null;
                    res.status(400).send(resp);
                }

                else if (!resp.success)
                    res.status(400).send(resp);
                else
                    res.send(resp);
            }
        } catch (ex) {
            appInsights.defaultClient.trackException({ exception: new Error(ex) });
            res.status(500);
        }
    }
}