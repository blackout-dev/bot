import {Presence} from 'discord.js';
import {logger} from '../util/logger';
import {queue, amqpUri} from '../util/config';
import {MessagePublisher, messagePublisherLogger} from '../rabbitmq/publish';

// Since this is not a constant TypeScript won't treat it the same way when we assert it to not be undefind
let temporaryMessagePublisher: MessagePublisher | undefined;

if (amqpUri) {
	temporaryMessagePublisher = new MessagePublisher(queue, amqpUri);
	temporaryMessagePublisher
		.init()
		.then(() => messagePublisherLogger.info('Message publisher initialized'))
		.catch(error => messagePublisherLogger.error(error));
}

const messagePublisher = temporaryMessagePublisher;

/**
 * Handle a presence update.
 * @param oldPresence Old presence to handle
 * @param newPresence New presence to handle
 */
export function handle(oldPresence: Presence | undefined, newPresence: Presence): void {
	const user = newPresence.user ?? newPresence.member?.user;

	if (!user) {
		logger.warn('No user in presence update');
	}

	if (user?.bot && user.client.user?.id !== user.id) {
		const offline = newPresence.status === 'offline';

		logger.info({user: newPresence.userID, offline});

		if (messagePublisher) {
			const send = async () =>
				messagePublisher
					.send({
						bot: user,
						online: !offline,
						time: new Date()
					})
					.catch(messagePublisherLogger.error);

			if (messagePublisher.ready) {
				send().catch(messagePublisherLogger.error);
			} else {
				messagePublisherLogger.warn('Message publisher not ready');
				messagePublisher.once('ready', send);
			}
		}
	}
}
