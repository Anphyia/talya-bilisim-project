import { Request, Response, NextFunction, Express } from "express";
import express from "express";
import mongoose from "mongoose";
import config from "./config/config";
import database from "./config/database";
import logger from "./utils/logger";
import * as healthController from "./controllers/healthController";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { requestLogger, corsHandler } from "./middleware/logging";

export const createServer = async () => {
    const app = express();

    // Connect to MongoDB
    try {
        await database.connect();
    } catch (error) {
        logger.error("Failed to connect to database:", error);
        process.exit(1);
    }

    // Security and CORS middleware
    app.use(corsHandler);

    // Request logging
    app.use(requestLogger);

    // Body parsing middleware
    app.use(express.json({
        limit: "10kb"
    }));
    app.use(express.urlencoded({ extended: true, limit: "10kb" }));

    // Health check routes
    app.get("/health", healthController.getHealth);
    app.get("/health/live", healthController.getLiveness);
    app.get("/health/ready", healthController.getReadiness);

    // Main routes
    app.get("/", (req: Request, res: Response) => {
        res.status(200).json({
            success: true,
            message: "Restaurant API is running",
            environment: config.get("NODE_ENV"),
            database: database.getConnectionStatus() ? "connected" : "disconnected",
            timestamp: new Date().toISOString()
        });
    });

    app.post("/", (req: Request, res: Response) => {
        res.status(200).json({
            success: true,
            message: "POST request received",
            body: req.body
        });
    });

    // 404 handler for undefined routes
    app.use(notFoundHandler);

    // Global error handler (must be last)
    app.use(errorHandler);

    return app;
}