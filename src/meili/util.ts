import MeiliSearch, {Index, IndexRequest} from 'meilisearch';
import {meiliLogger, BotDocument} from '.';
import {User} from 'discord.js';

/**
 * Words to ignore in search results.
 * @see https://docs.meilisearch.com/guides/advanced_guides/stop_words.html MeiliSearch documentation on stop words
 */
const stopWords: string[] = ['bot'];

/**
 * Find or create an index.
 * @param meili MeiliSearch client to initialize
 */
export async function index(meili: MeiliSearch, index: IndexRequest): Promise<Index> {
	const foundIndexs = await meili.listIndexes();

	// If the index existed in the list return that, create it otherwise

	if (foundIndexs.find(foundIndex => foundIndex.uid === index.uid)) {
		return meili.getIndex(index.uid);
	}

	const created = await meili.createIndex(index);

	created
		.updateStopWords(stopWords)
		.then(() => meiliLogger.debug(`Stop words updated for index ${index.uid}`))
		.catch(meiliLogger.error);

	return created;
}

/**
 * Convert a Discord.js user into a MeiliSearch document.
 * @param user Discord user
 * @returns A document read yot be inserted into MeiliSearch
 */
export function userToMeiliDoc(user: User): BotDocument {
	return {id: user.id, avatarHash: user.avatar, discriminator: Number.parseInt(user.discriminator, 10), username: user.username};
}
