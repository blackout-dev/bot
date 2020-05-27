import {logger} from '../util/logger';

/**
 * Emitted for general debugging information.
 * @param info The debug information
 */
export function handle(info: string): void {
	logger.debug(info);
}
