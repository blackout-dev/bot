import {logger} from '../util/logger';
import {PresenceUtil} from '../util/presence';

/**
 * Emitted when the client becomes ready to start working.
 * @param presenceUtil The presence util to use
 */
export function handle(presenceUtil: PresenceUtil): void {
	logger.info('Ready');

	const {client} = presenceUtil;

	// Publish every user's presence
	const [bots, humans] = client.users.cache.partition(user => user.bot && user.id !== client.user?.id);

	// Remove humans from the cache since we aren't ever going to need that data
	humans.forEach(human => client.users.cache.delete(human.id));

	logger.info(`Reporting ${bots.size} presence updates at boot`);

	bots.forEach(bot => {
		logger.info({presence: bot.presence});

		// Publish the account's presence
		presenceUtil.send(bot.presence);
	});
}
