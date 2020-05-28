import {Client} from 'discord.js';
import {handle as debug} from './events/debug';
import {handle as error} from './events/error';
import {handle as presenceUpdate} from './events/presence-update';
import {handle as ready} from './events/ready';
import {handle as warn} from './events/warn';
import {clientOptions} from './util/client-options';
import {discordToken} from './util/config';
import {logger} from './util/logger';

/** Discord.js client. */
export const client = new Client(clientOptions);

client
	.on('debug', debug)
	.on('error', error)
	.on('presenceUpdate', presenceUpdate)
	.on('ready', () => ready(client))
	.on('warn', warn);

client.login(discordToken).catch(error => logger.fatal(error));
