import * as joi from 'joi';
import { Constraint } from '../../../modules/common';
import { ModelUser } from '../../users/models/index';

export class UserEmailPasswordAuthRequest {
    @Constraint(joi.string().email().required())
    email: string;
    @Constraint(joi.string().required())
    password: string;
}

export class AccesTokenAuthResponse {
    success: boolean;
    message: string;
    access_token: string;
    user: ModelUser;
}

export class UserEmailAuthRequest {
    @Constraint(joi.string().required())
    email: string;
}

export class SendEmailVerificationResponse {
    @Constraint(joi.string().email().required())
    email: string;
    @Constraint(joi.string().required())
    emailVerificationSent: boolean;
}

export class SendEmailPasswordLostResponse {
    @Constraint(joi.string().email().required())
    email: string;
    @Constraint(joi.string().required())
    emailPasswordLostSent: boolean;
}


