import {logger} from '../util/logger';

/**
 * Emitted for general warnings.
 * @param error The warning
 */
export function handle(info: string): void {
	logger.warn(info);
}
