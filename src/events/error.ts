import {logger} from '../util/logger';

/**
 * Emitted when the client encounters an error.
 * @param error The error encountered
 */
export function handle(error: Error): void {
	logger.error(error);
}
