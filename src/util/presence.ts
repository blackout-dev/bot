import {Presence, Client, PresenceStatus} from 'discord.js';
import {MessagePublisher, messagePublisherLogger} from '../rabbitmq/message-publisher';
import {logger} from './logger';

/**
 * Helps with handling presences from the Discord API.
 */
export class PresenceUtil {
	public static logger = logger.child({child: 'presence util'});
	/**
	 * Create a `PresenceUtil` for a Discord.js client.
	 * @param client The client that is receiving presences
	 */
	constructor(public readonly client: Client, private readonly messagePublisher: MessagePublisher) {}

	/**
	 * Check's if a presence status is online.
	 * @param presenceStatus The presence status to check
	 * @returns `true` if the user is online
	 */
	static isOnline(presenceStatus: PresenceStatus): boolean {
		return presenceStatus !== 'offline';
	}

	/**
	 * Determine if a presence is one we want to be handling.
	 * @param presence Presence to filter
	 * @returns `true` if a presence is a bot account and not the client
	 */
	filterPresence(presence: Presence): boolean {
		return (presence.user?.bot && this.client.user!.id !== presence.userID) ?? false;
	}

	/**
	 * Publishes a presence to a RabbitMQ channel.
	 * The presence is filtered beforehand to make sure it should be published.
	 * This doesn't publish messages synchronously.
	 * @param presence Presence to send
	 */
	send(presence: Presence): void {
		if (this.filterPresence(presence)) {
			const online = PresenceUtil.isOnline(presence.status);

			const data = {bot: presence.userID, online, time: new Date()};

			PresenceUtil.logger.info(data);

			const send = async () => this.messagePublisher.send(data);
			if (this.messagePublisher.ready) {
				send().catch(error => {
					throw error;
				});
			} else {
				messagePublisherLogger.warn('Message publisher not ready');
				this.messagePublisher.once('ready', send);
			}
		}
	}
}
