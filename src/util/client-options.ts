import {ClientOptions, Intents} from 'discord.js';

export const clientOptions: ClientOptions = {
	disableMentions: 'everyone',
	presence: {activity: {name: 'you', type: 'WATCHING'}},
	ws: {intents: [Intents.FLAGS.GUILD_PRESENCES]},
	fetchAllMembers: true
};
