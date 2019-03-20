import path = require( 'path' );
import _ = require( 'lodash' );
import { IServerConfiguration } from '../../../../modules/interfaces';

const env = process.env.NODE_ENV || 'development';
const config: IServerConfiguration = require(`./${env}`).default;

const defaults = {
	root: path.join(__dirname, '/..')
};

_.assign(config, defaults);

export default config;
