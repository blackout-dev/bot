import * as amqp from 'amqplib';
import {Channel} from 'amqplib';
import {Guild, Snowflake, User} from 'discord.js';

interface PresenceMessage {
	guildId: Snowflake;
	botId: Snowflake;
	online: boolean;
	time: string;
}

/**
 * Publishes message to a RabbitMQ broker.
 */
export class MessagePublisher {
	channel?: Channel;
	ready = false;
	constructor(private readonly queue: string, private readonly uri: string) {}

	/**
	 * Send a datapoint message to the message broker.
	 * @param data Data to send
	 */
	async send(data: {guild: Guild; bot: User; online: boolean; time: Date}): Promise<boolean> {
		if (this.channel) {
			return this.channel.sendToQueue(
				this.queue,
				Buffer.from(
					JSON.stringify({
						botId: data.bot.id,
						guildId: data.guild.id,
						online: data.online,
						time: data.time.toString()
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
	}
}
