import { IServerConfiguration } from '../../../../modules/interfaces';
/*
	TO CONNECT TO REMOTE MONGODB SERVER
*/
const userDB = encodeURIComponent('user');
const passwordDB = encodeURIComponent('password');
const serverIpDB = encodeURIComponent('IP REMOTE SERVER');
const serverPortDB = encodeURIComponent('27017');
const dbNameDB = encodeURIComponent('sample-typescript-swagger-api-dev');



const config: IServerConfiguration = {
	env: 'development',
	serverId: 'sample.typescript.swagger.api',
	port: 1337,
	host: 'http://sample.typescript.swagger.api:1337',
	machineKey : '6236b889-d26b-4115-8f4f-d77800a3d18c',
	mongodb:'mongodb://127.0.0.1:27017/sample-typescript-swagger-api-dev',
	//mongodb:`mongodb://${userDB}:${passwordDB}@${serverIpDB}:${serverPortDB}/${dbNameDB}`, // TO CONNECT REMOTE MONGODB SERVER
	secret:'=!P$HkFs28v5kb85CdLJ@dzqafFFMV=pqDfS@8MGzkFF*#Lu&B',
	appInsightsKey:'def8cd37-8160-419c-b725-b8d0e0d900c3'
};

export default config;
