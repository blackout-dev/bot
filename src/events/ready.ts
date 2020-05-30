import {BotDocument, botsIndexRequest, meili, meiliLogger} from '../meili';
import {index} from '../meili/util';
import {logger} from '../util/logger';
import {PresenceUtil} from '../util/presence';

/**
 * Emitted when the client becomes ready to start working.
 * @param presenceUtil The presence util to use
 */
export async function handle(presenceUtil: PresenceUtil): Promise<void> {
	logger.info('Ready');

	const {client} = presenceUtil;

	// Publish every user's presence
	const [bots, humans] = client.users.cache.partition(user => user.bot && user.id !== client.user?.id);

	// Remove humans from the cache since we aren't ever going to need that data
	humans.forEach(human => client.users.cache.delete(human.id));

	logger.info(`Reporting ${bots.size} presence updates at boot`);

	const botIndex = await index(meili, botsIndexRequest);

	botIndex
		.addDocuments(bots.map((bot): BotDocument => ({id: bot.id, username: bot.username})))
		.then(response => meiliLogger.info({response, msg: 'MeiliSearch bots index updated with new user info'}))
		.catch(error => meiliLogger.error(error));

	bots.forEach(bot => {
		logger.info({presence: bot.presence});

		// Publish the account's presence
		presenceUtil.send(bot.presence);
	});
}
