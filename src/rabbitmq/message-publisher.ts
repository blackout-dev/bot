import * as amqp from 'amqplib';
import {Channel} from 'amqplib';
import {Snowflake} from 'discord.js';
import {EventEmitter} from 'events';
import {logger} from '../util/logger';

/**
 * The format of a message that must be followed when it's published to AMQP for processing.
 */
interface PresenceMessage {
	bot_id: Snowflake;
	online: boolean;
	when: string;
}

/**
 * The child logger to use for message publisher related events.
 */
export const messagePublisherLogger = logger.child({child: 'message publisher'});

/**
 * Publishes message to a RabbitMQ broker.
 */
export class MessagePublisher extends EventEmitter {
	/** The AMQP channel to use for publishing messages to. */
	channel?: Channel;
	/** If the message publisher is connected and ready to start publishing messages. */
	ready = false;
	/** The child logger to use for instances of MessagePublishers. */
	logger = messagePublisherLogger;

	/**
	 * Create a message publisher for a specific queue on a specific broker.
	 * @param queue The name of the queue to use
	 * @param uri The AMQP URI to use to connect to the broker
	 */
	constructor(private readonly queue: string, private readonly uri: string) {
		super();
	}

	/**
	 * Send a datapoint message to the message broker.
	 * @param data Data to send
	 */
	async send(data: {bot: Snowflake; online: boolean; time: Date}): Promise<boolean> {
		if (this.channel) {
			return this.channel.sendToQueue(
				this.queue,
				Buffer.from(
					JSON.stringify({
						bot_id: data.bot,
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
