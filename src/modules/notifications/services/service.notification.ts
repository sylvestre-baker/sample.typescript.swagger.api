
import { injectable, inject } from 'inversify';

import * as OneSignal from 'onesignal-node';

import { TYPES } from '../../../modules/common';

@injectable()
export class ServiceNotification {
    private hubName: string;
    private connectionString: string;
    private client: OneSignal.Client;
    constructor(
    ) {
         this.client = new OneSignal.Client({
            userAuthKey: 'ZTRmODhiMzctMjgwZi00N2JiLTg1ZjUtZGI4NTVlOTdlOTU3',
            // note that "app" must have "appAuthKey" and "appId" keys    
            app: { appAuthKey: 'ZGQyZWFhOTktMjBiOC00NTE2LWEzYTgtOTJjOTRmNzZiYzgx', appId: '7a0a6c05-3809-4867-88ae-4374bf964d8f' }
        });
    }

 

    async sendFromOneSignalToAll(message: string, player_id:string): Promise<boolean> {
        return new Promise<boolean>((resolve) => {

            var firstNotification = new OneSignal.Notification({
                contents: {
                    en: "Test notification",
                    fr: message,
                },
                include_player_ids: [player_id]
            });

            this.client.sendNotification(firstNotification, function (err, httpResponse, data) {
                if (err) {
                    console.log('Something went wrong...');
                    resolve(false);
                } else {
                    console.log(data, httpResponse.statusCode);
                    resolve(true);
                }
            });
        });
    }
}