import * as dotenv from 'dotenv';
import {join as joinPaths} from 'path';

if (process.env.NODE_ENV !== 'production') {
	const path = joinPaths(__dirname, '..', '..', 'bot.env');

	dotenv.config({path});
}

/** API token for Discord. */
export const discordToken = process.env.DISCORD_TOKEN;

/** AMQP URI. */
export const amqpUri = process.env.AMQP_URI;

/** Queue to use for RabbitMQ. */
export const queue = 'record-presence';

/** Host to use for MeiliSearch. */
export const meiliSearchHost = process.env.MEILI_SEARCH_HOST;

/** Private key to use for authenticating with MeiliSearch. */
export const meiliSearchPrivateKey = process.env.MEILI_SEARCH_PRIVATE_KEY;
