
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../modules/common';

import {
    UserEmailAuthRequest,
    AccesTokenAuthResponse,
    UserEmailPasswordAuthRequest,
    SendEmailVerificationResponse,
    SendEmailPasswordLostResponse
} from '../models';
import { StoreUser, ServiceUser } from '../../users';
import { CreateUserRequest } from '../../users/models/user';
import configAuth from '../models/config.auth';
import * as  jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import * as  generator from 'generate-password';
@injectable()
export class ServiceAuthentification {
    constructor(
        @inject(TYPES.StoreUser) private storeUser: StoreUser,
        @inject(TYPES.ServiceUser) private serviceUser: ServiceUser,
    ) {

    }

    async signup(newUser: CreateUserRequest, host: string): Promise<AccesTokenAuthResponse> {
        let accesTokenAuthResponse = new AccesTokenAuthResponse();
        let user = await this.storeUser.getByEmail(newUser.email);
        if (user) {
            accesTokenAuthResponse.message = `User with this email ${newUser.email} already exists`;
            accesTokenAuthResponse.success = false;
            accesTokenAuthResponse.user = null;
            accesTokenAuthResponse.access_token = null;
            return accesTokenAuthResponse;
        }

        else {

            const userResp = await this.serviceUser.create(newUser, host);
            if (userResp.success == false) {
                accesTokenAuthResponse.message = userResp.message;
                accesTokenAuthResponse.success = false;
                accesTokenAuthResponse.user = null;
                accesTokenAuthResponse.access_token = null;
                return accesTokenAuthResponse;
            }
            else {
                user = userResp.user;
                const payload = {
                    admin: user.isAdmin,
                    claims: user.claims,
                    userId: user._id,
                    email: user.email
                };

                var token = jwt.sign(payload, configAuth.secret, {
                    expiresIn: 60 * 60 * 24 // expires in 24 hours
                });
                user = await this.storeUser.setAccessToken(user._id.toString(), token);

                accesTokenAuthResponse.message = `User with this email ${newUser.email} signup successfully`;
                accesTokenAuthResponse.success = true;
                accesTokenAuthResponse.user = user;
                accesTokenAuthResponse.access_token = token;
                delete accesTokenAuthResponse.user.password;
                delete accesTokenAuthResponse.user.oldPasswords;
                delete accesTokenAuthResponse.user.accessToken;
                return accesTokenAuthResponse;
            }
        }
    }

    async signin(userSignin: UserEmailPasswordAuthRequest): Promise<AccesTokenAuthResponse> {
        let accesTokenAuthResponse = new AccesTokenAuthResponse();
        let user = await this.storeUser.getByEmail(userSignin.email);
        if (!user) {
            accesTokenAuthResponse.message = `User with this email ${userSignin.email} does not exist`;
            accesTokenAuthResponse.success = false;
            accesTokenAuthResponse.user = null;
            accesTokenAuthResponse.access_token = null;
            return accesTokenAuthResponse;
        }
        else if (await bcrypt.compare(userSignin.password, user.password) == false) {
            accesTokenAuthResponse.message = `User with this email ${userSignin.email} bad password`;
            accesTokenAuthResponse.success = false;
            accesTokenAuthResponse.user = null;
            accesTokenAuthResponse.access_token = null;
            return accesTokenAuthResponse;
        }
        else {
            const payload = {
                admin: user.isAdmin,
                claims: user.claims,
                userId: user._id,
                email: user.email
            };

            var token = jwt.sign(payload, configAuth.secret, {
                expiresIn: 60 * 60 * 24 // expires in 24 hours
            });
            user = await this.storeUser.setAccessToken(user._id.toString(), token);

            accesTokenAuthResponse.message = `User with this email ${userSignin.email} signin successfully`;
            accesTokenAuthResponse.success = true;
            accesTokenAuthResponse.user = user;
            accesTokenAuthResponse.access_token = token;
            delete accesTokenAuthResponse.user.password;
            delete accesTokenAuthResponse.user.oldPasswords;
            delete accesTokenAuthResponse.user.accessToken;
            return accesTokenAuthResponse;
        }
    }
}