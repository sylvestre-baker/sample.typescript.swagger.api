import { httpGet, httpPost, controller } from 'inversify-express-utils';
import { injectable, inject } from 'inversify';
import { validateBody, validateQuery, authorize, authorizeAdmin, ResponseFailure } from '../../../modules/common';

import { Request, Response, NextFunction } from 'express';

import { TYPES } from '../../../modules/common/';
import { ServiceAuthentification, UserEmailAuthRequest, UserEmailPasswordAuthRequest, AccesTokenAuthResponse, AuthResponse } from '../../../modules/auth/index';
import { CreateUserRequest, FindUserByEmailRequest, ServiceUser, UserResponse, FindUserByEmailVerificationIdRequest, ServiceUserAdmin, CreateUserAdminRequest } from '../../../modules/users/index';
import * as appInsights from 'applicationinsights';
import { ApiPath, ApiOperationPost, ApiOperationPut, ApiOperationDelete, SwaggerDefinitionConstant } from 'swagger-express-ts';

@ApiPath({
    path: "/auth",
    name: "Authentification",
})
@controller('/auth')
@injectable()
export class ControllerAuthentification {
    constructor(
        @inject(TYPES.ServiceAuthentification) private serviceAuthentification: ServiceAuthentification,
        @inject(TYPES.ServiceUserAdmin) private serviceUserAdmin: ServiceUserAdmin,
    ) { }

    @ApiOperationPost({
        path: '/signup',
        description: "Signup",
        summary: "Signup",
        parameters: {
            body: { description: "Signup", required: true, model: "CreateUserAdminRequest" }
        },

        responses: {
            200: { model: "AuthAdminResponse" },
            400: { model: "AuthErrorResponse" },
            500: { model: "AuthErrorResponse" }
        },
    })
    @httpPost('/signup', validateBody(CreateUserAdminRequest))
    public async signup(req: Request, res: Response) {
        appInsights.defaultClient.trackNodeHttpRequest({ request: req, response: res });
        try {
            const resp = await this.serviceAuthentification.signupAdmin(req.body, req.get('host'));
            if (!resp) {
                res.status(400).send(`Object AuthResponse is null`);
            }
            else
                res.status(resp.code).send(resp);

        } catch (ex) {
            appInsights.defaultClient.trackException({ exception: new Error(ex) });
            res.status(500).send(ResponseFailure(500, ex));
        }
    }


    @ApiOperationPost({
        path: '/signin',
        description: "Signin",
        summary: "Signin",
        parameters: {
            body: { description: "Signin", required: true, model: "UserEmailPasswordAuthRequest" }
        },

        responses: {
            200: { model: "AuthAdminResponse" },
            400: { model: "AccesTokenAuthResponse" }
        },
    })
    @httpPost('/signin', validateBody(UserEmailPasswordAuthRequest))
    public async signin(req: Request, res: Response) {
        appInsights.defaultClient.trackNodeHttpRequest({ request: req, response: res });
        try {
            const resp = await this.serviceAuthentification.signinAdmin(req.body);
            if (!resp) {
                res.status(400).send(`Object AuthResponse is null`);
            }
            else
                res.status(resp.code).send(resp);
        } catch (ex) {
            appInsights.defaultClient.trackException({ exception: new Error(ex) });
            res.status(500).send(ResponseFailure(500, ex));
        }
    }


    @ApiOperationPost({
        path: '/find/email/exist',
        description: "Find email exist",
        summary: "Find email exist",
        parameters: {
            body: { description: "Find email exist", required: true, model: "FindUserByEmailRequest" }
        },

        responses: {
            200: { model: "UserAdminResponse" },
            400: { model: "UserErrorResponse" },
            500: { model: "UserErrorResponse" }
        },
    })
    @httpPost('/find/email/exist', validateBody(FindUserByEmailRequest))
    public async userWithEmailExist(req: Request, res: Response) {
        appInsights.defaultClient.trackNodeHttpRequest({ request: req, response: res });
        try {
            const resp = await this.serviceUserAdmin.findByEmail(req.body);
            if (!resp) {
                res.status(400).send(`Object UserResponse is null`);
            }
            else
                res.status(resp.code).send(resp);

        } catch (ex) {
            appInsights.defaultClient.trackException({ exception: new Error(ex) });
            res.status(500).send(ResponseFailure(500, ex));
        }
    }

    @ApiOperationPost({
        path: '/verify',
        description: "Verify email",
        summary: "Verify email",
        parameters: {
            query: {
                id: {
                    required: true,
                    type: SwaggerDefinitionConstant.Parameter.Type.STRING,
                }
            }
        },

        responses: {
            200: { model: "UserAdminResponse" },
            400: { model: "UserErrorResponse" },
            405: { model: "UserErrorResponse" },
            500: { model: "UserErrorResponse" }
        },
    })
    @httpGet('/verify')
    public async verify(req: Request, res: Response) {
        appInsights.defaultClient.trackNodeHttpRequest({ request: req, response: res });
        try {
            if ((req.protocol + "://" + req.get('host')) == ("http://" + req.get('host'))) {
                const find = new FindUserByEmailVerificationIdRequest();
                find.emailVerificationId = req.query.id;

                const resp = await this.serviceUserAdmin.verifyEmail(find);
                console.log("Domain is matched. Information is from Authentic email");
                if (!resp) {
                    res.status(400).send(`Object UserResponse is null`);
                }
                else
                    res.status(resp.code).send(resp);
            }
            else {
                res.status(405).send(ResponseFailure(405, "Request is from unknown source"));
            }

        } catch (ex) {
            appInsights.defaultClient.trackException({ exception: new Error(ex) });
            res.status(500).send(ResponseFailure(500, ex));
        }
    }
}
