import {logger} from '../util/logger';
import {Client} from 'discord.js';

/**
 * Emitted when the client becomes ready to start working.
 * @param client The client that became ready
 */
export function handle(client: Client): void {
	logger.info('ready');

	// Publish every user's presence
	const bots = client.users.cache.filter(user => user.bot);

	bots.map(bot => {
		// Publish the account's presence
		client.emit('presenceUpdate', undefined, bot.presence);
		// Remove this user from the cache
		client.users.cache.delete(bot.id);
	});
}
