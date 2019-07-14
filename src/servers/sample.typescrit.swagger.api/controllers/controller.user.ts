import { httpGet, httpPost, httpPut, httpDelete, controller } from 'inversify-express-utils';

import { injectable, inject } from 'inversify';

import { Request, Response, NextFunction } from 'express';
import { validateBody, validateQuery, authorize, authorizeAdmin, validate, ResponseFailure, validateParams } from '../../../modules/common';


import { TYPES } from '../../../modules/common/';
import { ServiceUser, FindUserByIdRequest, UserResponse, FindUserByEmailRequest, EditUserRequest, EditUserPasswordRequest, EditUserEmailRequest, EditUserFacebookInformationsRequest, EditUserMobileTokensRequest } from '../../../modules/users/index';
import * as jwt from 'jsonwebtoken';
import config from '../config/env';
import * as appInsights from 'applicationinsights';
import { ApiPath, ApiOperationPost, ApiOperationPut, ApiOperationDelete, SwaggerDefinitionConstant } from 'swagger-express-ts';

@ApiPath({
    path: "/user",
    name: "User",
    security: { apiKeyHeader: [] }
})
@injectable()
@controller('/user', authorize())
export class ControllerUser {
    constructor(
        @inject(TYPES.ServiceUser) private serviceUser: ServiceUser,

    ) { }

    @ApiOperationPost({
        path: '/find/userId',
        description: "Find user by userId",
        summary: "Find user by userId",
        parameters: {
            body: { description: "Find user by userId", required: true, model: "FindUserByIdRequest" }
        },

        responses: {
            200: { model: "UserResponse" },
            400: { model: "UserErrorResponse" },
            405: { model: "UserErrorResponse" },
            500: { model: "UserErrorResponse" }
        },
        security: { apiKeyHeader: [] }
    })

    @httpPost('/find/userId', validateBody(FindUserByIdRequest))
    public async find(req: Request, res: Response) {
        appInsights.defaultClient.trackNodeHttpRequest({ request: req, response: res });
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, config.secret);
            if (decodedToken.userId != req.body.userId) {
                res.status(405).send(ResponseFailure(405, `User with this id ${req.body.userId} is not allowed`));
            }
            else {
                const resp = await this.serviceUser.find(req.body);
                if (!resp) {
                    res.status(400).send(`Object UserResponse is null`);
                }
                else
                    res.status(resp.code).send(resp);
            }
        } catch (ex) {
            appInsights.defaultClient.trackException({ exception: new Error(ex) });
            res.status(500).send(ResponseFailure(500, ex));
        }
    }

    @ApiOperationPost({
        path: '/find/email',
        description: "Find user by email",
        summary: "Find user by email",
        parameters: {
            body: { description: "Find user by email", required: true, model: "FindUserByEmailRequest" }
        },

        responses: {
            200: { model: "UserResponse" },
            400: { model: "UserErrorResponse" },
            405: { model: "UserErrorResponse" },
            500: { model: "UserErrorResponse" }
        },
        security: { apiKeyHeader: [] }
    })
    @httpPost('/find/email', validateBody(FindUserByEmailRequest))
    public async findByEmail(req: Request, res: Response) {
        appInsights.defaultClient.trackNodeHttpRequest({ request: req, response: res });
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, config.secret);
            if (decodedToken.email != req.body.email) {
                res.status(405).send(ResponseFailure(405, `User with this email ${req.body.email} is not allowed`));
            }
            else {
                const resp = await this.serviceUser.findByEmail(req.body);
                if (!resp) {
                    res.status(400).send(`Object UserResponse is null`);
                }
                else
                    res.status(resp.code).send(resp);
            }
        } catch (ex) {
            appInsights.defaultClient.trackException({ exception: new Error(ex) });
            res.status(500).send(ResponseFailure(500, ex));
        }
    }

    @ApiOperationPut({
        path: '/update/userId',
        description: "Update user by userId",
        summary: "Update user by userId",
        parameters: {
            body: { description: "Update user by userId", required: true, model: "EditUserRequest" }
        },

        responses: {
            200: { model: "UserResponse" },
            400: { model: "UserErrorResponse" },
            405: { model: "UserErrorResponse" },
            500: { model: "UserErrorResponse" }
        },
        security: { apiKeyHeader: [] }
    })
    @httpPut('/update/userId', validateBody(EditUserRequest))
    public async update(req: Request, res: Response) {
        appInsights.defaultClient.trackNodeHttpRequest({ request: req, response: res });
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, config.secret);
            if (decodedToken.userId != req.body.userId) {
                res.status(405).send(ResponseFailure(405, `User with this email ${req.body.email} is not allowed`));
            }
            else {
                const resp = await this.serviceUser.update(req.body);
                if (!resp) {
                    res.status(400).send(`Object UserResponse is null`);
                }
                else
                    res.status(resp.code).send(resp);
            }
        } catch (ex) {
            appInsights.defaultClient.trackException({ exception: new Error(ex) });
            res.status(500).send(ResponseFailure(500, ex));
        }
    }

    @ApiOperationPut({
        path: '/update/password',
        description: "Update password of user by userId",
        summary: "Update password of user by userId",
        parameters: {
            body: { description: "Update password of by userId", required: true, model: "EditUserPasswordRequest" }
        },

        responses: {
            202: { model: "UserResponse" },
            400: { model: "UserErrorResponse" },
            405: { model: "UserErrorResponse" },
            500: { model: "UserErrorResponse" }
        },
        security: { apiKeyHeader: [] }
    })
    @httpPut('/update/password', validateBody(EditUserPasswordRequest))
    public async editPassword(req: Request, res: Response) {
        appInsights.defaultClient.trackNodeHttpRequest({ request: req, response: res });
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, config.secret);
            if (decodedToken.userId != req.body.userId) {
                res.status(405).send(ResponseFailure(405, `User with this id ${req.body.userId} is not allowed`));
            }
            else {
                const resp = await this.serviceUser.editPassword(req.body);
                if (!resp) {
                    res.status(400).send(`Object UserResponse is null`);
                }
                else
                    res.status(resp.code).send(resp);
            }
        }
        catch (ex) {
            appInsights.defaultClient.trackException({ exception: new Error(ex) });
            res.status(500).send(ResponseFailure(500, ex));
        }
    }

    @ApiOperationPut({
        path: '/update/email',
        description: "Update email of user by userId",
        summary: "Update email of user by userId",
        parameters: {
            body: { description: "Update email of user by userId", required: true, model: "EditUserEmailRequest" }
        },

        responses: {
            202: { model: "UserResponse" },
            400: { model: "UserErrorResponse" },
            405: { model: "UserErrorResponse" },
            500: { model: "UserErrorResponse" }
        },
        security: { apiKeyHeader: [] }
    })
    @httpPut('/update/email', validateBody(EditUserEmailRequest))
    public async editEmail(req: Request, res: Response) {
        appInsights.defaultClient.trackNodeHttpRequest({ request: req, response: res });
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, config.secret);
            if (decodedToken.userId != req.body.userId) {
                res.status(405).send(ResponseFailure(405, `User with this id ${req.body.userId} is not allowed`));
            }
            else {
                const resp = await this.serviceUser.editEmail(req.body, req.get('host'));
                if (!resp) {
                    res.status(400).send(`Object UserResponse is null`);
                }
                else
                    res.status(resp.code).send(resp);
            }
        } catch (ex) {
            appInsights.defaultClient.trackException({ exception: new Error(ex) });
            res.status(500).send(ResponseFailure(500, ex));
        }

    }

    @ApiOperationPut({
        path: '/update/facebook',
        description: "Update facebook of user by userId",
        summary: "Update facebook of user by userId",
        parameters: {
            body: { description: "Update facebook of user by userId", required: true, model: "EditUserFacebookInformationsRequest" }
        },

        responses: {
            200: { model: "UserResponse" },
            400: { model: "UserErrorResponse" },
            405: { model: "UserErrorResponse" },
            500: { model: "UserErrorResponse" }
        },
        security: { apiKeyHeader: [] }
    })
    @httpPut('/update/facebook', validateBody(EditUserFacebookInformationsRequest))
    public async setFacebookInfos(req: Request, res: Response) {
        appInsights.defaultClient.trackNodeHttpRequest({ request: req, response: res });
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, config.secret);
            if (decodedToken.userId != req.body.userId) {
                res.status(405).send(ResponseFailure(405, `User with this id ${req.body.userId} is not allowed`));
            }
            else {
                const resp = await this.serviceUser.setFacebookInfos(req.body);
                if (!resp) {
                    res.status(400).send(`Object UserResponse is null`);
                }
                else
                    res.status(resp.code).send(resp);
            }
        } catch (ex) {
            appInsights.defaultClient.trackException({ exception: new Error(ex) });
            res.status(500).send(ResponseFailure(500, ex));
        }
    }

    @ApiOperationPut({
        path: '/update/mobileToken',
        description: "Update mobileToken of user by userId",
        summary: "Update mobileToken of user by userId",
        parameters: {
            body: { description: "Update mobileToken of user by userId", required: true, model: "EditUserMobileTokensRequest" }
        },

        responses: {
            200: { model: "UserResponse" },
            400: { model: "UserErrorResponse" },
            405: { model: "UserErrorResponse" },
            500: { model: "UserErrorResponse" }
        },
        security: { apiKeyHeader: [] }
    })
    @httpPut('/update/mobileToken', validateBody(EditUserMobileTokensRequest))
    public async setMobileToken(req: Request, res: Response) {
        appInsights.defaultClient.trackNodeHttpRequest({ request: req, response: res });
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, config.secret);
            if (decodedToken.userId != req.body.userId) {
                res.status(405).send(ResponseFailure(405, `User with this id ${req.body.userId} is not allowed`));
            }
            else {
                const resp = await this.serviceUser.setMobileToken(req.body);
                if (!resp) {
                    res.status(400).send(`Object UserResponse is null`);
                }
                else
                    res.status(resp.code).send(resp);
            }
        } catch (ex) {
            appInsights.defaultClient.trackException({ exception: new Error(ex) });
            res.status(500).send(ResponseFailure(500, ex));
        }
    }

    @ApiOperationPost({
        path: '/send/emailVerification',
        description: "Send email to user by userId",
        summary: "Send email to user by userId",
        parameters: {
            body: { description: "Send email to user by userId", required: true, model: "FindUserByIdRequest" }
        },

        responses: {
            202: { model: "UserResponse" },
            400: { model: "UserErrorResponse" },
            405: { model: "UserErrorResponse" },
            500: { model: "UserErrorResponse" }
        },
        security: { apiKeyHeader: [] }
    })
    @httpPost('/send/emailVerification', validateBody(FindUserByIdRequest))
    public async sendEmailVerification(req: Request, res: Response) {
        appInsights.defaultClient.trackNodeHttpRequest({ request: req, response: res });
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, config.secret);
            if (decodedToken.userId != req.body.userId) {
                res.status(405).send(ResponseFailure(405, `User with this id ${req.body.userId} is not allowed`));
            }
            else {
                const resp = await this.serviceUser.sendEmailVerification(req.body, req.get('host'));
                if (!resp) {
                    res.status(400).send(`Object UserResponse is null`);
                }
                else
                    res.status(resp.code).send(resp);
            }
        } catch (ex) {
            appInsights.defaultClient.trackException({ exception: new Error(ex) });
            res.status(500).send(ResponseFailure(500, ex));
        }
    }



    @ApiOperationDelete({
        path: '/remove/userId',
        description: "Delete user by userId",
        summary: "Delete user by userId",
        parameters: {
            query: {
                userId: {
                    description: "Id of user",
                    type: SwaggerDefinitionConstant.Parameter.Type.STRING,
                    required: true
                }
            }
        },

        responses: {
            200: { model: "UserResponse" },
            400: { model: "UserErrorResponse" },
            405: { model: "UserErrorResponse" },
            500: { model: "UserErrorResponse" }
        },
        security: { apiKeyHeader: [] }
    })
    @httpDelete('/remove/userId', validateQuery(FindUserByIdRequest))
    public async remove(req: Request, res: Response) {
        appInsights.defaultClient.trackNodeHttpRequest({ request: req, response: res });
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, config.secret);
            if (decodedToken.userId != req.query.userId) {
                res.status(405).send(ResponseFailure(405, `User with this id ${req.query.userId} is not allowed`));
            }
            else {
                const resp = await this.serviceUser.remove(req.query);
                if (!resp) {
                    res.status(400).send(`Object UserResponse is null`);
                }
                else
                    res.status(resp.code).send(resp);
            }
        } catch (ex) {
            appInsights.defaultClient.trackException({ exception: new Error(ex) });
            res.status(500).send(ResponseFailure(500, ex));
        }
    }
}

