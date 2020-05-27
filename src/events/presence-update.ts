import {Presence} from 'discord.js';
import {logger} from '../util/logger';
import {queue, amqpUri} from '../util/config';
import {MessagePublisher} from '../rabbitmq/publish';

let messagePublisher: MessagePublisher | undefined;

if (amqpUri) {
	messagePublisher = new MessagePublisher(queue, amqpUri);
	messagePublisher.init();
}

/**
 * Handle a presence update.
 * @param oldPresence Old presence to handle
 * @param newPresence New presence to handle
 */
export function handle(
	oldPresence: Presence | undefined,
	newPresence: Presence
): void {
	const {user} = newPresence;

	if (user && newPresence.guild && user.client.user?.id !== user.id) {
		// If (user?.bot && newPresence.guild && user?.client.user?.id !== user?.id) {
		const offline = newPresence.status === 'offline';

		logger.info({user: newPresence.userID, offline});

		if (messagePublisher) {
			if (messagePublisher.ready) {
				messagePublisher.send({
					bot: user,
					guild: newPresence.guild,
					online: !offline,
					time: new Date()
				});
			} else {
				logger.warn('message publisher not ready');
			}
		}
	}
}
