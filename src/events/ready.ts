import {logger} from '../util/logger';

/**
 * Emitted when the client becomes ready to start working.
 */
export function handle(): void {
	logger.info('ready');
}
