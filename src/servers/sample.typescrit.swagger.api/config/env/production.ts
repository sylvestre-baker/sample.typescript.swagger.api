import { IServerConfiguration } from '../../../../modules/interfaces';

const config: IServerConfiguration = {
    env: 'production',
    serverId: 'sample.typescript.swagger.api',
    port: 3000,
    host: 'http://sample.typescript.swagger.api:3000',
    machineKey: '208bf11d-b016-464f-810e-8690c3be62d0',
    mongodb:'mongodb://127.0.0.1:27017/sample-typescript-swagger-api-prod',
    secret:'7X=8g=c_7#@Jvw?98G8N3C6^pYkavNJVn!yMvYU?HX%9?t4PJx',
    appInsightsKey:'def8cd37-8160-419c-b725-b8d0e0d900c3'
};

export default config;
