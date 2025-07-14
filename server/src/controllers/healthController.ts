import { Request, Response } from "express";
import mongoose from "mongoose";
import config from "../config/config";
import database from "../config/database";

interface HealthStatus {
    status: 'healthy' | 'unhealthy';
    timestamp: string;
    uptime: number;
    environment: string;
    version: string;
    services: {
        database: {
            status: 'connected' | 'disconnected';
            responseTime?: number;
        };
    };
}

export const getHealth = async (req: Request, res: Response): Promise<void> => {
    const startTime = Date.now();

    // Check database connectivity
    let dbStatus: 'connected' | 'disconnected' = 'disconnected';
    let dbResponseTime: number | undefined;

    try {
        if (database.getConnectionStatus() && mongoose.connection.readyState === 1 && mongoose.connection.db) {
            // Simple ping to database
            await mongoose.connection.db.admin().ping();
            dbStatus = 'connected';
            dbResponseTime = Date.now() - startTime;
        }
    } catch (error) {
        dbStatus = 'disconnected';
    }

    const healthStatus: HealthStatus = {
        status: dbStatus === 'connected' ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.get("NODE_ENV"),
        version: process.env.npm_package_version || '1.0.0',
        services: {
            database: {
                status: dbStatus,
                responseTime: dbResponseTime
            }
        }
    };

    const statusCode = healthStatus.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(healthStatus);
};

export const getLiveness = (req: Request, res: Response): void => {
    res.status(200).json({
        status: 'alive',
        timestamp: new Date().toISOString()
    });
};

export const getReadiness = async (req: Request, res: Response): Promise<void> => {
    const isReady = database.getConnectionStatus() && mongoose.connection.readyState === 1;

    res.status(isReady ? 200 : 503).json({
        status: isReady ? 'ready' : 'not ready',
        timestamp: new Date().toISOString(),
        database: database.getConnectionStatus()
    });
};
