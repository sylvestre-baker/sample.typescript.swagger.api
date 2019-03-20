import { httpGet, httpPost, controller } from 'inversify-express-utils';
import { injectable, inject } from 'inversify';
import { validateBody, validateQuery, authorize, authorizeAdmin } from '../../../modules/common';

import { Request, Response, NextFunction } from 'express';

import { TYPES } from '../../../modules/common/';
import { ServiceAuthentification, UserEmailAuthRequest, UserEmailPasswordAuthRequest, AccesTokenAuthResponse } from '../../../modules/auth/index';
import { CreateUserRequest, FindUserByEmailRequest, ServiceUser, UserResponse, FindUserByEmailVerificationIdRequest } from '../../../modules/users/index';
import * as appInsights from 'applicationinsights';

@controller('/auth')
@injectable()
export class ControllerAuthentification {
    constructor(
        @inject(TYPES.ServiceAuthentification) private serviceAuthentification: ServiceAuthentification,
        @inject(TYPES.ServiceUser) private serviceUser: ServiceUser,
    ) { }

    @httpPost('/signup', validateBody(CreateUserRequest))
    public async signup(req: Request, res: Response) {
        appInsights.defaultClient.trackNodeHttpRequest({ request: req, response: res });
        try {
            const accesTokenAuthResponse = await this.serviceAuthentification.signup(req.body, req.get('host'));
            if (!accesTokenAuthResponse) {
                const resp = new AccesTokenAuthResponse();
                resp.access_token = null;
                resp.message = 'BAD REQUEST';
                resp.success = false;
                resp.user = null;
                res.status(400).send(resp);
            }
            if (!accesTokenAuthResponse.success)
                res.status(400).send(accesTokenAuthResponse);
            else
                res.send(accesTokenAuthResponse);
        }
        catch (ex) {
            appInsights.defaultClient.trackException({ exception: new Error(ex) });
            res.status(500);
        }
    }

    @httpPost('/signin', validateBody(UserEmailPasswordAuthRequest))
    public async signin(req: Request, res: Response) {
        appInsights.defaultClient.trackNodeHttpRequest({ request: req, response: res });
        try {
            const accesTokenAuthResponse = await this.serviceAuthentification.signin(req.body);
            if (!accesTokenAuthResponse) {
                const resp = new AccesTokenAuthResponse();
                resp.access_token = null;
                resp.message = 'BAD REQUEST';
                resp.success = false;
                resp.user = null;
                res.status(400).send(resp);
            }
            if (!accesTokenAuthResponse.success)
                res.status(400).send(accesTokenAuthResponse);
            else
                res.send(accesTokenAuthResponse);
        }
        catch (ex) {
            appInsights.defaultClient.trackException({ exception: new Error(ex) });
            res.status(500);
        }
    }

    @httpPost('/find/email/exist', validateBody(FindUserByEmailRequest))
    public async userWithEmailExist(req: Request, res: Response) {
        appInsights.defaultClient.trackNodeHttpRequest({ request: req, response: res });
        try {
            const resp = await this.serviceUser.userWithEmailExist(req.body);
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
        } catch (ex) {
            appInsights.defaultClient.trackException({ exception: new Error(ex) });
            res.status(500);
        }
    }

    @httpGet('/verify')
    public async verify(req: Request, res: Response) {
        appInsights.defaultClient.trackNodeHttpRequest({ request: req, response: res });
        try {
            if ((req.protocol + "://" + req.get('host')) == ("http://" + req.get('host'))) {
                const find = new FindUserByEmailVerificationIdRequest();
                find.emailVerificationId = req.query.id;

                const resp = await this.serviceUser.verifyEmail(find, req.get('host'));
                console.log("Domain is matched. Information is from Authentic email");
                if (resp.success) {
                    res.end(`<h1>${resp.message} </h1>`);
                }
                else {
                    res.end(`<h1>${resp.message} </h1>`);
                }
            }
            else {
                res.end("<h1>Request is from unknown source");
            }

        } catch (ex) {
            appInsights.defaultClient.trackException({ exception: new Error(ex) });
            res.status(500);
        }
    }
}