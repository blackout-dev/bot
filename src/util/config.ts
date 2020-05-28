import * as dotenv from 'dotenv';
import {join as joinPaths} from 'path';

const path = joinPaths(__dirname, '..', '..', 'bot.env');

if (process.env.NODE_ENV !== 'production') {
	dotenv.config({path});
}

/** API token for Discord. */
export const discordToken = process.env.DISCORD_TOKEN;

/** AMQP URI. */
export const amqpUri = process.env.AMQP_URI;

/** Queue to use for RabbitMQ. */
export const queue = 'record-presence';
