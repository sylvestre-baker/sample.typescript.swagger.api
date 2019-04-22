import { injectable, inject } from 'inversify';
import { TYPES } from '../../../modules/common';
import { StoreGodfather, StoreGodchild } from '../../godfathers/index';
import { AddGodchildToGodfatherRequest, GodfatherResponse, GodchildResponse } from '../models/index';
import { StoreUser } from '../../users/index';

@injectable()
export class ServiceGodfather {
    constructor(
        @inject(TYPES.StoreUser) private storeUser: StoreUser,
        @inject(TYPES.StoreGodfather) private storeGodfather: StoreGodfather,
        @inject(TYPES.StoreGodchild) private storeGodchild: StoreGodchild,

    ) {
    }

    async addGodchild(newGodchild: AddGodchildToGodfatherRequest): Promise<GodchildResponse> {
        const godchildResponse = new GodchildResponse();
        const godfather = await this.storeGodfather.getByUserIdAndCode(newGodchild.godfatherUserId, newGodchild.godfatherCode);
        let godchild = await this.storeGodchild.getByUserIdAndCode(newGodchild.godchildUserId, newGodchild.godchildCode);
        if (!godfather) {
            godchildResponse.message = `User with this godfatherCode ${newGodchild.godchildCode} does not exist`;
            godchildResponse.success = false;
            godchildResponse.code = -1;
            godchildResponse.godchild = null;
            return godchildResponse;
        }

        else if (godchild) {
            godchildResponse.message = `User with this godfatherCode ${newGodchild.godchildCode} already exists`;
            godchildResponse.success = false;
            godchildResponse.code = -1;
            godchildResponse.godchild = null;
            return godchildResponse;
        }

        else {
            const user = await this.storeUser.get(newGodchild.godchildUserId);
            godchild = await this.storeGodchild.create(user.email, user._id.toString(), newGodchild.godfatherCode, user.godfatherCode);

            if (godchild) {

                godchildResponse.message = `Godchild with this email ${user.email} created successfully`;
                godchildResponse.success = true;
                godchildResponse.code = 1;
                godchildResponse.godchild = godchild;

                return godchildResponse;

            }
            else {
                return null;
            }
        }

    }
}
