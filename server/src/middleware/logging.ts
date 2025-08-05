import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
import config from "../config/config";

interface RequestWithTimestamp extends Request {
    startTime?: number;
}

export const requestLogger = (req: RequestWithTimestamp, res: Response, next: NextFunction): void => {
    req.startTime = Date.now();

    // Log request start
    if (config.isDevelopment()) {
        logger.info(`${req.method} ${req.url}`, {
            ip: req.ip,
            userAgent: req.get('User-Agent')
        });
    }

    // Override res.end to log response
    const originalEnd = res.end;
    res.end = function (chunk?: any, encoding?: any, cb?: any): Response {
        const duration = req.startTime ? Date.now() - req.startTime : 0;

        logger.info(`${req.method} ${req.url} - ${res.statusCode}`, {
            duration: `${duration}ms`,
            ip: req.ip,
            statusCode: res.statusCode
        });

        // Call original end method
        return originalEnd.call(this, chunk, encoding, cb);
    };

    next();
};

export const corsHandler = (req: Request, res: Response, next: NextFunction): void => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
        return;
    }

    next();
};
