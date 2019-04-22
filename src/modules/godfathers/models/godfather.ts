import * as joi from 'joi';
import { Constraint } from '../../../modules/common';
import { ModelGodfather, ModelGodchild } from './db/index';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

@ApiModel({
    description: "Godfather Response description",
    name: "GodfatherResponse"
})
export class GodfatherResponse {
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
        description: "Response ModelGodfather",
        model: "ModelGodfather"
    })
    godfather: ModelGodfather = null;
}


@ApiModel({
    description: "Godchild Response description",
    name: "GodchildResponse"
})
export class GodchildResponse {
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
        description: "Response ModelGodchild",
        model: "ModelGodchild"
    })
    godchild: ModelGodchild = null;
}


@ApiModel({
    description: "Add godchild to godfather user by userId",
    name: "AddGodchildToGodfatherRequest"
})
export class AddGodchildToGodfatherRequest {
    @ApiModelProperty({
        description: "godfatherUserId",
        required: true
    })
    @Constraint(joi.string().required())
    godfatherUserId: string;
    @ApiModelProperty({
        description: "godfatherCode",
        required: true
    })
    @Constraint(joi.string().required())
    godfatherCode: string;
    @ApiModelProperty({
        description: "godchildUserId",
        required: true
    })
    @Constraint(joi.string().required())
    godchildUserId: string;
    @ApiModelProperty({
        description: "godchildCode",
        required: true
    })
    @Constraint(joi.string().required())
    godchildCode: string;
}
