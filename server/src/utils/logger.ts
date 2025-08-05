interface LogLevel {
    INFO: string;
    WARN: string;
    ERROR: string;
    DEBUG: string;
}

class Logger {
    private levels: LogLevel = {
        INFO: '\x1b[36m[INFO]\x1b[0m',
        WARN: '\x1b[33m[WARN]\x1b[0m',
        ERROR: '\x1b[31m[ERROR]\x1b[0m',
        DEBUG: '\x1b[35m[DEBUG]\x1b[0m'
    };

    private formatMessage(level: string, message: string, ...args: any[]): string {
        const timestamp = new Date().toISOString();
        const formattedMessage = args.length > 0 ? `${message} ${args.map(arg =>
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ')}` : message;

        return `${timestamp} ${level} ${formattedMessage}`;
    }

    public info(message: string, ...args: any[]): void {
        console.log(this.formatMessage(this.levels.INFO, message, ...args));
    }

    public warn(message: string, ...args: any[]): void {
        console.warn(this.formatMessage(this.levels.WARN, message, ...args));
    }

    public error(message: string, ...args: any[]): void {
        console.error(this.formatMessage(this.levels.ERROR, message, ...args));
    }

    public debug(message: string, ...args: any[]): void {
        if (process.env.NODE_ENV !== 'production') {
            console.log(this.formatMessage(this.levels.DEBUG, message, ...args));
        }
    }
}

export default new Logger();
