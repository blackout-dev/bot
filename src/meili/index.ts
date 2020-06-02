import {Snowflake} from 'discord.js';
import MeiliSearch, {IndexRequest} from 'meilisearch';
import {meiliSearchHost} from '../util/config';
import {logger} from '../util/logger';

export const meiliLogger = logger.child({child: 'meili'});

if (meiliSearchHost === undefined) {
	throw new TypeError('MeiliSearch host is undefined');
}

/** MeiliSearch client. */
export const meili = new MeiliSearch({host: meiliSearchHost});

/** Index request for the `bots` index. */
export const botsIndexRequest: IndexRequest = {uid: 'bots', primaryKey: 'id' as keyof BotDocument};

/**
 * A bot document in MeiliSearch.
 */
export interface BotDocument {
	id: Snowflake;
	username: string;
}
