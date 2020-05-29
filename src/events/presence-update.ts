import {Presence} from 'discord.js';
import {logger} from '../util/logger';
import {PresenceUtil} from '../util/presence';

/**
 * Handle a presence update.
 * @param presenceUtil The presence util to use
 * @param oldPresence Old presence to handle
 * @param newPresence New presence to handle
 */
export function handle(presenceUtil: PresenceUtil, oldPresence: Presence | undefined, newPresence: Presence): void {
	const user = newPresence.user ?? newPresence.member?.user;

	// This shouldn't ever really happen
	if (!user) {
		logger.warn('No user in presence update');
	}

	presenceUtil.send(newPresence);
}
