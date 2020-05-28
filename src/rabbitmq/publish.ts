import * as amqp from 'amqplib';
import {Channel} from 'amqplib';
import {Snowflake, User} from 'discord.js';
import {logger} from '../util/logger';
import {EventEmitter} from 'events';

interface PresenceMessage {
	bot_id: Snowflake;
	online: boolean;
	when: string;
}

export const messagePublisherLogger = logger.child({child: 'message publisher'});

/**
 * Publishes message to a RabbitMQ broker.
 */
export class MessagePublisher extends EventEmitter {
	channel?: Channel;
	ready = false;
	logger = messagePublisherLogger;
	constructor(private readonly queue: string, private readonly uri: string) {
		super();
	}

	/**
	 * Send a datapoint message to the message broker.
	 * @param data Data to send
	 */
	async send(data: {bot: User; online: boolean; time: Date}): Promise<boolean> {
		if (this.channel) {
			return this.channel.sendToQueue(
				this.queue,
				Buffer.from(
					JSON.stringify({
						bot_id: data.bot.id,
						online: data.online,
						when: data.time.toUTCString()
					} as PresenceMessage)
				)
			);
		}

		throw new TypeError('Channel has not been initialized, use MessagePublisher#init');
	}

	/**
	 * Connect to the broker.
	 */
	async init(): Promise<void> {
		const open = amqp.connect(this.uri);

		const connection = await open;

		this.channel = await connection.createChannel();

		await this.channel.assertQueue(this.queue);

		this.ready = true;
		this.emit('ready');
	}
}
