import {ClientOptions, Intents} from 'discord.js';

/**
 * Options to use for the Discord.js client.
 * @see https://discord.js.org/#/docs/main/stable/typedef/ClientOptions Discord.js docs
 */
export const clientOptions: ClientOptions = {
	disableMentions: 'everyone',
	presence: {activity: {name: 'your bots', type: 'WATCHING'}},
	ws: {intents: [Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILDS]},
	fetchAllMembers: true
};
