import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
import config from "../config/config";

export interface AppError extends Error {
    statusCode: number;
    isOperational: boolean;
}

export class ApiError extends Error implements AppError {
    public statusCode: number;
    public isOperational: boolean;

    constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        Error.captureStackTrace(this, this.constructor);
    }
}

// Error handling middleware
export const errorHandler = (
    error: AppError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const { statusCode = 500, message, stack } = error;

    logger.error(`Error ${statusCode}: ${message}`, {
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        stack: config.isDevelopment() ? stack : undefined
    });

    // Don't leak error details in production
    const response = {
        success: false,
        message: config.isDevelopment() ? message : 'An error occurred',
        ...(config.isDevelopment() && { stack })
    };

    res.status(statusCode).json(response);
};

// 404 handler
export const notFoundHandler = (req: Request, res: Response): void => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
};

// Async error wrapper
export const asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
