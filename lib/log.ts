import { Log, LogCollector, LogFunction, LogLevel, LogLevels } from '@/types/log';

export function createLogCollector(): LogCollector {
	const log: Log[] = [];
	const getAll = () => log;

	const logFunctions = {} as Record<LogLevel, LogFunction>;

	LogLevels.forEach(level => (logFunctions[level] = (message: string) => {
		log.push({
			message,
			level,
			timestamp: new Date(),
		});
	}));

	return {
		getAll,
		...logFunctions
	};
}