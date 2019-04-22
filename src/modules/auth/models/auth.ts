import * as joi from 'joi';
import { Constraint } from '../../../modules/common';
import { ModelUser } from '../../users/models/index';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

@ApiModel({
    description: "UserEmailPasswordAuthRequest",
    name: "UserEmailPasswordAuthRequest"
})
export class UserEmailPasswordAuthRequest {
    @ApiModelProperty({
        description: "email",
        required: true
    })
    @Constraint(joi.string().email().required())
    email: string;

    @ApiModelProperty({
        description: "password",
        required: true
    })
    @Constraint(joi.string().required())
    password: string;
}

@ApiModel({
    description: "AccesTokenAuthResponse",
    name: "AccesTokenAuthResponse"
})
export class AccesTokenAuthResponse {
    @ApiModelProperty({
        description: "success"
    })
    success: boolean;

    @ApiModelProperty({
        description: "message",
    })
    message: string;

    @ApiModelProperty({
        description: "access_token",
    })
    access_token: string;

    @ApiModelProperty({
        description: "user",
        model:"ModelUser"
    })
    user: ModelUser;
}


@ApiModel({
    description: "UserEmailAuthRequest",
    name: "UserEmailAuthRequest"
})
export class UserEmailAuthRequest {
    @ApiModelProperty({
        description: "email",
        required: true
    })
    @Constraint(joi.string().email().required())
    email: string;
}

@ApiModel({
    description: "SendEmailVerificationResponse",
    name: "SendEmailVerificationResponse"
})
export class SendEmailVerificationResponse {
    @ApiModelProperty({
        description: "email",
        required: true
    })
    @Constraint(joi.string().email().required())
    email: string;

    @ApiModelProperty({
        description: "emailVerificationSent",
        required: true
    })
    @Constraint(joi.string().required())
    emailVerificationSent: boolean;
}

@ApiModel({
    description: "SendEmailPasswordLostResponse",
    name: "SendEmailPasswordLostResponse"
})
export class SendEmailPasswordLostResponse {
    @ApiModelProperty({
        description: "email"
    })
    @Constraint(joi.string().email().required())
    email: string;

    @ApiModelProperty({
        description: "emailPasswordLostSent"
    })
    @Constraint(joi.string().required())
    emailPasswordLostSent: boolean;
}


