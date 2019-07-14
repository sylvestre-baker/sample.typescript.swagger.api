import * as joi from 'joi';
import { Constraint } from '../../../modules/common';
import { ModelUser, ModelGender } from './db/index';
import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { IModelResponse } from '../../interfaces/api/index';

@ApiModel({
    description: "User Response",
    name: "UserResponse"
})
export class UserResponse implements IModelResponse {
    @ApiModelProperty({
        description: "code",
        required: true
    })
    code: number;
    message: string;
    error: string;
    @ApiModelProperty({
        description: "data",
        model: "ModelUser",
        required: true
    })
    data: ModelUser;
}

@ApiModel({
    description: "User Error Response",
    name: "UserErrorResponse"
})
export class UserErrorResponse implements IModelResponse {
    @ApiModelProperty({
        description: "code",
        required: true
    })
    code: number;
    @ApiModelProperty({
        description: "message"
    })
    message: string;
    @ApiModelProperty({
        description: "error",
        required: true
    })
    error: string;

    data: any;
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
        description: "BirthDate",
        required: true,
    })
    @Constraint(joi.date().iso().required())
    birthDate: string;


    @ApiModelProperty({
        description: "Photo URL",
        required: false
    })
    @Constraint(joi.string().allow(''))
    photoUrl: string;

    @ApiModelProperty({
        description: "Facebook ID",
        required: false
    })
    @Constraint(joi.string().allow(''))
    facebookId: string;

    @ApiModelProperty({
        description: "Facebook Access Token",
        required: false
    })
    @Constraint(joi.string().allow(''))
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
        description: "BirthDate",
        required: true,
    })
    @Constraint(joi.date().iso().required())
    birthDate: string;

    @ApiModelProperty({
        description: "phoneNumber",
        required: false
    })
    @Constraint(joi.string().allow(''))
    phoneNumber: string;

    @ApiModelProperty({
        description: "photoUrl",
        required: false
    })
    @Constraint(joi.string().allow(''))
    photoUrl: string;

    @ApiModelProperty({
        description: "facebookId",
        required: false
    })
    @Constraint(joi.string().allow(''))
    facebookId: string;

    @ApiModelProperty({
        description: "facebookAccessToken",
        required: false
    })
    @Constraint(joi.string().allow(''))
    facebookAccessToken: string;

    @ApiModelProperty({
        description: "gender",
        required: false
    })
    @Constraint(joi.string().valid([ModelGender.female, ModelGender.male]))
    gender: ModelGender;

    @ApiModelProperty({
        description: "address",
        required: false
    })
    @Constraint(joi.string().allow(''))
    address: string;

    @ApiModelProperty({
        description: "country",
        required: false
    })
    @Constraint(joi.string().allow(''))
    country: string;

    @ApiModelProperty({
        description: "state",
        required: false
    })
    @Constraint(joi.string().allow(''))
    state: string;

    @ApiModelProperty({
        description: "city",
        required: false
    })
    @Constraint(joi.string().allow(''))
    city: string;

    @ApiModelProperty({
        description: "mobileToken",
        required: true
    })
    @Constraint(joi.string().allow(''))
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
        description: "oldPassword",
        required: true
    })
    @Constraint(joi.string().required())
    oldPassword: string;

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
    description: "Find User By EmailVerificationId Request",
    name: "FindUserByEmailVerificationIdRequest"
})
export class FindUserByEmailVerificationIdRequest {
    @ApiModelProperty({
        description: "emailVerificationId",
        required: true
    })
    @Constraint(joi.string().required())
    emailVerificationId: string;
}

@ApiModel({
    description: "Find User By PasswordVerificationId Request",
    name: "FindUserByPasswordVerificationIdRequest"
})
export class FindUserByPasswordVerificationIdRequest {
    @ApiModelProperty({
        description: "emailVerificationId",
        required: true
    })
    @Constraint(joi.string().required())
    passwordVerificationId: string;
}


