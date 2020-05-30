import {Snowflake} from 'discord.js';
import MeiliSearch, * as meiliSearch from 'meilisearch';
import {logger} from '../util/logger';
import {meiliSearchHost} from '../util/config';

export const meiliLogger = logger.child({child: 'meili'});

/** MeiliSearch client. */
// This weird spacing is to just ignore the constructor for `MeiliSearch`
// prettier-ignore
export const meili: MeiliSearch =
// The default export for MeiliSearch is broken
// @ts-expect-error
new meiliSearch
({host: meiliSearchHost});

/** Index request for the `bots` index. */
export const botsIndexRequest: meiliSearch.IndexRequest = {uid: 'bots', primaryKey: 'id' as keyof BotDocument};

/**
 * A bot document in MeiliSearch.
 */
export interface BotDocument {
	id: Snowflake;
	username: string;
}
