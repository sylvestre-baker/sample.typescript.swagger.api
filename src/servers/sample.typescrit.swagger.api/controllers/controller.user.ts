import { httpGet, httpPost, httpPut, httpDelete, controller } from 'inversify-express-utils';

import { injectable, inject } from 'inversify';

import { Request, Response, NextFunction } from 'express';
import { validateBody, validateQuery, authorize, authorizeAdmin, validate } from '../../../modules/common';


import { TYPES } from '../../../modules/common/';
import { ServiceUser, FindUserByIdRequest, UserResponse, FindUserByEmailRequest, EditUserRequest, EditUserPasswordRequest, EditUserEmailRequest, EditUserFacebookInformationsRequest, EditUserMobileTokensRequest, EditUserPhotoByIdRequest } from '../../../modules/users/index';
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
            400: { model: "UserResponse" }
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
                const resp = new UserResponse();
                resp.message = `User with this id ${req.body.userId} is not allowed`;
                resp.success = false;
                resp.user = null;
                res.status(400).send(resp);
            }
            else {
                const resp = await this.serviceUser.find(req.body);
                if (!resp) {
                    const resp = new UserResponse();
                    resp.message = 'BAD REQUEST';
                    resp.success = false;
                    resp.user = null;
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

    @ApiOperationPost({
        path: '/find/email',
        description: "Find user by email",
        summary: "Find user by email",
        parameters: {
            body: { description: "Find user by email", required: true, model: "FindUserByEmailRequest" }
        },

        responses: {
            200: { model: "UserResponse" },
            400: { model: "UserResponse" }
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
                const resp = new UserResponse();
                resp.message = `User with this email ${req.body.email} is not allowed`;
                resp.success = false;
                resp.user = null;
                res.status(400).send(resp);
            }
            else {
                const resp = await this.serviceUser.findByEmail(req.body);
                if (!resp) {
                    const resp = new UserResponse();
                    resp.message = 'BAD REQUEST';
                    resp.success = false;
                    resp.user = null;
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

    @ApiOperationPut({
        path: '/update/userId',
        description: "Update user by userId",
        summary: "Update user by userId",
        parameters: {
            body: { description: "Update user by userId", required: true, model: "EditUserRequest" }
        },

        responses: {
            200: { model: "UserResponse" },
            400: { model: "UserResponse" }
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
                const resp = new UserResponse();
                resp.message = `User with this id ${req.body.userId} is not allowed`;
                resp.success = false;
                resp.user = null;
                res.status(400).send(resp);
            }
            else {
                const resp = await this.serviceUser.update(req.body);
                if (!resp) {
                    const resp = new UserResponse();
                    resp.message = 'BAD REQUEST';
                    resp.success = false;
                    resp.user = null;
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

    @ApiOperationPut({
        path: '/update/password',
        description: "Update password of user by userId",
        summary: "Update password of user by userId",
        parameters: {
            body: { description: "Update password of by userId", required: true, model: "EditUserPasswordRequest" }
        },

        responses: {
            200: { model: "UserResponse" },
            400: { model: "UserResponse" }
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
                const resp = new UserResponse();
                resp.message = `User with this id ${req.body.userId} is not allowed`;
                resp.success = false;
                resp.user = null;
                res.status(400).send(resp);
            }
            else {
                const resp = await this.serviceUser.editPassword(req.body);
                if (!resp) {
                    const resp = new UserResponse();
                    resp.message = 'BAD REQUEST';
                    resp.success = false;
                    resp.user = null;
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

    @ApiOperationPut({
        path: '/update/email',
        description: "Update email of user by userId",
        summary: "Update email of user by userId",
        parameters: {
            body: { description: "Update email of user by userId", required: true, model: "EditUserEmailRequest" }
        },

        responses: {
            200: { model: "UserResponse" },
            400: { model: "UserResponse" }
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
                const resp = new UserResponse();
                resp.message = `User with this id ${req.body.userId} is not allowed`;
                resp.success = false;
                resp.user = null;
                res.status(400).send(resp);
            }
            else {
                const resp = await this.serviceUser.editEmail(req.body, req.get('host'));
                if (!resp) {
                    const resp = new UserResponse();
                    resp.message = 'BAD REQUEST';
                    resp.success = false;
                    resp.user = null;
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

    @ApiOperationPut({
        path: '/update/facebook',
        description: "Update facebook of user by userId",
        summary: "Update facebook of user by userId",
        parameters: {
            body: { description: "Update facebook of user by userId", required: true, model: "EditUserFacebookInformationsRequest" }
        },

        responses: {
            200: { model: "UserResponse" },
            400: { model: "UserResponse" }
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
                const resp = new UserResponse();
                resp.message = `User with this id ${req.body.userId} is not allowed`;
                resp.success = false;
                resp.user = null;
                res.status(400).send(resp);
            }
            else {
                const resp = await this.serviceUser.setFacebookInfos(req.body);
                if (!resp) {
                    const resp = new UserResponse();
                    resp.message = 'BAD REQUEST';
                    resp.success = false;
                    resp.user = null;
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

    @ApiOperationPut({
        path: '/update/mobileToken',
        description: "Update mobileToken of user by userId",
        summary: "Update mobileToken of user by userId",
        parameters: {
            body: { description: "Update mobileToken of user by userId", required: true, model: "EditUserMobileTokensRequest" }
        },

        responses: {
            200: { model: "UserResponse" },
            400: { model: "UserResponse" }
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
                const resp = new UserResponse();
                resp.message = `User with this id ${req.body.userId} is not allowed`;
                resp.success = false;
                resp.user = null;
                res.status(400).send(resp);
            }
            else {
                const resp = await this.serviceUser.setMobileToken(req.body);
                if (!resp) {
                    const resp = new UserResponse();
                    resp.message = 'BAD REQUEST';
                    resp.success = false;
                    resp.user = null;
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

    @ApiOperationPost({
        path: '/send/emailVerification',
        description: "Send email to user by userId",
        summary: "Send email to user by userId",
        parameters: {
            body: { description: "Send email to user by userId", required: true, model: "FindUserByIdRequest" }
        },

        responses: {
            200: { model: "UserResponse" },
            400: { model: "UserResponse" }
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
                const resp = new UserResponse();
                resp.message = `User with this id ${req.body.userId} is not allowed`;
                resp.success = false;
                resp.user = null;
                res.status(400).send(resp);
            }
            else {
                const resp = await this.serviceUser.sendEmailVerification(req.body, req.get('host'));
                if (!resp) {
                    const resp = new UserResponse();
                    resp.message = 'BAD REQUEST';
                    resp.success = false;
                    resp.user = null;
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

    @ApiOperationDelete({
        path: '/remove/userId',
        description: "Delete user by userId",
        summary: "Delete user by userId",
        parameters: {
            path: {
                id: {
                    description: "Id of user",
                    type: SwaggerDefinitionConstant.Parameter.Type.STRING,
                    required: true
                }
            }
        },

        responses: {
            200: { model: "UserResponse" },
            400: { model: "UserResponse" }
        },
        security: { apiKeyHeader: [] }
    })
    @httpDelete('/remove/userId', validateQuery(FindUserByIdRequest))
    public async remove(req: Request, res: Response) {
        appInsights.defaultClient.trackNodeHttpRequest({ request: req, response: res });
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, config.secret);
            if (decodedToken.userId != req.body.userId) {
                const resp = new UserResponse();
                resp.message = `User with this id ${req.body.userId} is not allowed`;
                resp.success = false;
                resp.user = null;
                res.status(400).send(resp);
            }
            else {
                const resp = await this.serviceUser.remove(req.body);
                if (!resp) {
                    const resp = new UserResponse();
                    resp.message = 'BAD REQUEST';
                    resp.success = false;
                    resp.user = null;
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

