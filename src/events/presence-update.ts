import {Presence} from 'discord.js';
import {logger} from '../util/logger';
import {PresenceUtil} from '../util/presence';
import {meili, botsIndexRequest, BotDocument, meiliLogger} from '../meili';
import {index} from '../meili/util';

/**
 * Handle a presence update.
 * @param presenceUtil The presence util to use
 * @param oldPresence Old presence to handle
 * @param newPresence New presence to handle
 */
export async function handle(presenceUtil: PresenceUtil, oldPresence: Presence | undefined, newPresence: Presence): Promise<void> {
	const user = newPresence.user ?? newPresence.member?.user;

	if (user) {
		const botsIndex = await index(meili, botsIndexRequest);

		const documents: BotDocument[] = [{id: user.id, username: user.username}];

		botsIndex
			.updateDocuments(documents)
			.then(response => meiliLogger.debug({response, msg: `MeiliSearch document updated for bot ${user.username} ${user.id}`}))
			.catch(meiliLogger.error);
	} else {
		// This shouldn't ever really happen
		logger.warn('No user in presence update');
	}

	presenceUtil.send(newPresence);
}
