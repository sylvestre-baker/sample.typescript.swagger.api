import { IServerConfiguration } from '../../../../modules/interfaces';

const config: IServerConfiguration = {
    env: 'preproduction',
    serverId: 'sample.typescript.swagger.api',
    port: 4000,
    host: 'sample.typescript.swagger.api:4000',
    machineKey: '65021ee8-021c-455a-b993-c4fedb20a491',
    mongodb:'mongodb://127.0.0.1:27017/sample-typescript-swagger-api-preprod',
    secret:'PyLy7Q$r!Jh$L-y#Czq?cex9EL&#5&mTvKv!FupGgU3U^FaMcT',
    appInsightsKey:'def8cd37-8160-419c-b725-b8d0e0d900c3'

};

export default config;
