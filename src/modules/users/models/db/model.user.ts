import { ApiModel, ApiModelProperty } from "swagger-express-ts";


@ApiModel({
    description: "Push One Signal Model from DB",
    name: "ModelPushOneSignal"
})
export class ModelPushOneSignal {
    @ApiModelProperty()
    userIdOneSignal: string;
    @ApiModelProperty()
    pushToken: string;
}


@ApiModel({
    description: "Address Model from DB",
    name: "ModelAddress"
})
export class ModelAddress {
    @ApiModelProperty()
    country: string;
    @ApiModelProperty()
    state: string;
    @ApiModelProperty()
    city: string;
    @ApiModelProperty()
    address: string;
}

@ApiModel({
    description: "User Model from DB",
    name: "ModelUser"
})
export class ModelUser {
    @ApiModelProperty()
    _id: string;
    @ApiModelProperty()
    uuidMobile: string;
    @ApiModelProperty()
    accessToken: string;
    @ApiModelProperty()
    mobileToken: string;
    @ApiModelProperty()
    firstname: string;
    @ApiModelProperty()
    lastname: string;
    @ApiModelProperty()
    email: string;
    @ApiModelProperty()
    birthDate: string;
    @ApiModelProperty()
    phoneNumber: string;
    @ApiModelProperty({
        model:'ModelAddress'
    })
    address: ModelAddress = new ModelAddress();
    @ApiModelProperty()
    claims: ModelClaims = ModelClaims.USER;
    @ApiModelProperty()
    photoUrl: string;
    password: string;
    @ApiModelProperty()
    enable: boolean = true;
    @ApiModelProperty()
    emailVerified: boolean = false;
    @ApiModelProperty()
    emailVerificationId: string;
    oldPasswords: string[] = [];
    @ApiModelProperty()
    gender: ModelGender;
    @ApiModelProperty()
    godfatherCode: string;
    @ApiModelProperty()
    facebookId: string;
    @ApiModelProperty()
    facebookAccessToken: string;
    @ApiModelProperty()
    pubToken: string;
    @ApiModelProperty({
        model: 'ModelPushOneSignal'
    })
    push: ModelPushOneSignal;
    @ApiModelProperty()
    isAdmin: boolean = false;
    @ApiModelProperty()
    passwordVerificationId: string;


}


@ApiModel({
    description: "User Admin Model from DB",
    name: "ModelUserAdmin"
})
export class ModelUserAdmin {
    @ApiModelProperty()
    _id: string;
    @ApiModelProperty()
    accessToken: string;
    @ApiModelProperty()
    firstname: string;
    @ApiModelProperty()
    lastname: string;
    @ApiModelProperty()
    email: string;
    @ApiModelProperty()
    claims: ModelClaims = ModelClaims.ADMIN;
    password: string;
    @ApiModelProperty()
    enable: boolean = true;
    @ApiModelProperty()
    emailVerified: boolean = false;
    @ApiModelProperty()
    emailVerificationId: string;
    oldPasswords: string[] = [];
    @ApiModelProperty()
    isAdmin: boolean = true;
}


export enum ModelClaims {
    ADMIN = 'ADMIN',
    USER = 'USER'
}

export enum ModelGender {
    female = 'female',
    male = 'male'
}
