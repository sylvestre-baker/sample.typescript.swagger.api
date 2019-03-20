export interface IServerConfiguration {
    serverId: string;
    env: string;
    host: string;
    port: number;
    mongodb: string;
    machineKey: string;
    secret: string;
    appInsightsKey:string;
}
