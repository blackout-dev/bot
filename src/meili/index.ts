import {Snowflake} from 'discord.js';
import MeiliSearch, {IndexRequest, DocumentLike} from 'meilisearch';
import {meiliSearchHost, meiliSearchPrivateKey} from '../util/config';
import {logger} from '../util/logger';

export const meiliLogger = logger.child({child: 'meili'});

if (meiliSearchHost === undefined) {
	throw new TypeError('MeiliSearch host is undefined');
}

if (meiliSearchPrivateKey === undefined) {
	meiliLogger.warn('No MeiliSearch private API key was defined');
}

/** MeiliSearch client. */
export const meili = new MeiliSearch({host: meiliSearchHost, apiKey: meiliSearchPrivateKey});

/** Index request for the `bots` index. */
export const botsIndexRequest: IndexRequest = {uid: 'bots', primaryKey: 'id'};

/**
 * A bot document in MeiliSearch.
 */
export interface BotDocument extends DocumentLike {
	id: Snowflake;
	username: string;
	discriminator: number;
	avatarHash: string | null;
}
