import * as joi from 'joi';
import { Constraint } from '../../../modules/common';
import { ModelUser } from './db/index';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

@ApiModel({
    description: "User Response description",
    name: "UserResponse"
})
export class UserResponse {
    @ApiModelProperty({
        description: "Success message"
    })
    success: boolean = false;

    @ApiModelProperty({
        description: "Response message"
    })
    message: string = 'Something Wrong';

    @ApiModelProperty({
        description: "Response code"
    })
    code: number = -1000;

    @ApiModelProperty({
        description: "Response User",
        model:"ModelUser"
    })
    user: ModelUser = null;
}


@ApiModel({
    description: "Create User Request description",
    name: "CreateUserRequest"
})
export class CreateUserRequest {
    @ApiModelProperty({
        description: "Firstname",
        required: true
    })
    @Constraint(joi.string().allow('').required())
    firstname: string;

    @ApiModelProperty({
        description: "Lastname",
        required: true
    })
    @Constraint(joi.string().allow('').required())
    lastname: string;

    @ApiModelProperty({
        description: "Email",
        required: true
    })
    @Constraint(joi.string().email().required())
    email: string;

    @ApiModelProperty({
        description: "Password",
        required: true
    })
    @Constraint(joi.string().regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/).required())
    password: string;

    @ApiModelProperty({
        description: "Photo URL",
        required: true
    })
    @Constraint(joi.string().allow('').required())
    photoUrl: string;

    @ApiModelProperty({
        description: "Facebook ID",
        required: true
    })
    @Constraint(joi.string().allow('').required())
    facebookId: string;

    @ApiModelProperty({
        description: "Facebook Access Token",
        required: true
    })
    @Constraint(joi.string().allow('').required())
    facebookAccessToken: string;
}


@ApiModel({
    description: "Find user by email",
    name: "FindUserByEmailRequest"
})
export class FindUserByEmailRequest {
    @ApiModelProperty({
        description: "email",
        required: true
    })
    @Constraint(joi.string().email().required())
    email: string;
}

@ApiModel({
    description: "Find user by userId",
    name: "FindUserByIdRequest"
})
export class FindUserByIdRequest {
    @ApiModelProperty({
        description: "UserId",
        required: true
    })
    @Constraint(joi.string().required())
    userId: string;
}

@ApiModel({
    description: "Edit photo of user by userId",
    name: "EditUserPhotoByIdRequest"
})
export class EditUserPhotoByIdRequest {
    @ApiModelProperty({
        description: "UserId",
        required: true
    })
    @Constraint(joi.string().required())
    userId: string;

    @ApiModelProperty({
        description: "contentBase64",
        required: true
    })
    @Constraint(joi.string().required())
    contentBase64: string;
}

@ApiModel({
    description: "Edit informations of user by userId",
    name: "EditUserRequest"
})
export class EditUserRequest {
    @ApiModelProperty({
        description: "UserId",
        required: true
    })
    @Constraint(joi.string().required())
    userId: string;

    @ApiModelProperty({
        description: "firstname",
        required: true
    })
    @Constraint(joi.string().required())
    firstname: string;

    @ApiModelProperty({
        description: "lastname",
        required: true
    })
    @Constraint(joi.string().required())
    lastname: string;

    @ApiModelProperty({
        description: "phoneNumber",
        required: true
    })
    @Constraint(joi.string().allow('').required())
    phoneNumber: string;

    @ApiModelProperty({
        description: "photoUrl",
        required: true
    })
    @Constraint(joi.string().allow('').required())
    photoUrl: string;

    @ApiModelProperty({
        description: "facebookId",
        required: true
    })
    @Constraint(joi.string().allow('').required())
    facebookId: string;

    @ApiModelProperty({
        description: "facebookAccessToken",
        required: true
    })
    @Constraint(joi.string().allow('').required())
    facebookAccessToken: string;

    @ApiModelProperty({
        description: "gender",
        required: true
    })
    @Constraint(joi.string().valid('male', 'female').required())
    gender: string;

    @ApiModelProperty({
        description: "address",
        required: true
    })
    @Constraint(joi.string().allow('').required())
    address: string;

    @ApiModelProperty({
        description: "country",
        required: true
    })
    @Constraint(joi.string().allow('').required())
    country: string;

    @ApiModelProperty({
        description: "state",
        required: true
    })
    @Constraint(joi.string().allow('').required())
    state: string;

    @ApiModelProperty({
        description: "city",
        required: true
    })
    @Constraint(joi.string().allow('').required())
    city: string;

    @ApiModelProperty({
        description: "mobileToken",
        required: true
    })
    @Constraint(joi.string().allow('').required())
    mobileToken: string;
}

@ApiModel({
    description: "Edit password of user by userId",
    name: "EditUserPasswordRequest"
})
export class EditUserPasswordRequest {
    @ApiModelProperty({
        description: "userId",
        required: true
    })
    @Constraint(joi.string().required())
    userId: string;

    @ApiModelProperty({
        description: "password",
        required: true
    })
    @Constraint(joi.string().regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/).required())
    password: string;
}

@ApiModel({
    description: "Edit email of user by userId",
    name: "EditUserEmailRequest"
})
export class EditUserEmailRequest {
    @ApiModelProperty({
        description: "userId",
        required: true
    })
    @Constraint(joi.string().required())
    userId: string;

    @ApiModelProperty({
        description: "email",
        required: true
    })
    @Constraint(joi.string().email().required())
    email: string;
}

@ApiModel({
    description: "Edit facebook informations of user by userId",
    name: "EditUserFacebookInformationsRequest"
})
export class EditUserFacebookInformationsRequest {
    @ApiModelProperty({
        description: "userId",
        required: true
    })
    @Constraint(joi.string().required())
    userId: string;

    @ApiModelProperty({
        description: "facebookId",
        required: true
    })
    @Constraint(joi.string().allow('').required())
    facebookId: string;

    @ApiModelProperty({
        description: "facebookAccessToken",
        required: true
    })
    @Constraint(joi.string().allow('').required())
    facebookAccessToken: string;
}

@ApiModel({
    description: "Edit facebook informations of user by userId",
    name: "EditUserFacebookInformationsRequest"
})
export class EditUserMobileTokensRequest {
    @ApiModelProperty({
        description: "userId",
        required: true
    })
    @Constraint(joi.string().required())
    userId: string;

    @ApiModelProperty({
        description: "mobileToken",
        required: true
    })
    @Constraint(joi.string().allow('').required())
    mobileToken: string;
}

@ApiModel({
    description: "Edit facebook informations of user by userId",
    name: "EditUserFacebookInformationsRequest"
})
export class FindUserByEmailVerificationIdRequest {
    @ApiModelProperty({
        description: "emailVerificationId",
        required: true
    })
    @Constraint(joi.string().required())
    emailVerificationId: string;
}

