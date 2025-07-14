import mongoose from "mongoose";
import logger from "../utils/logger";
import config from "./config";

export class DatabaseConnection {
    private static instance: DatabaseConnection;
    private isConnected: boolean = false;

    private constructor() { }

    public static getInstance(): DatabaseConnection {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection();
        }
        return DatabaseConnection.instance;
    }

    public async connect(): Promise<void> {
        if (this.isConnected) {
            logger.info("Database already connected");
            return;
        }

        try {
            const mongoUri = config.get("MONGO_URI");

            await mongoose.connect(mongoUri, {
                maxPoolSize: 10, // Maintain up to 10 socket connections
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
                bufferCommands: false // Disable mongoose buffering
            });

            this.isConnected = true;
            logger.info("✅ Connected to MongoDB successfully");

            // Handle connection events
            mongoose.connection.on("error", (error) => {
                logger.error("❌ MongoDB connection error:", error);
                this.isConnected = false;
            });

            mongoose.connection.on("disconnected", () => {
                logger.warn("⚠️ MongoDB disconnected");
                this.isConnected = false;
            });

            mongoose.connection.on("reconnected", () => {
                logger.info("🔄 MongoDB reconnected");
                this.isConnected = true;
            });

        } catch (error) {
            logger.error("❌ Failed to connect to MongoDB:", error);
            this.isConnected = false;
            throw error;
        }
    }

    public async disconnect(): Promise<void> {
        if (!this.isConnected) {
            return;
        }

        try {
            await mongoose.disconnect();
            this.isConnected = false;
            logger.info("🔌 Disconnected from MongoDB");
        } catch (error) {
            logger.error("❌ Error disconnecting from MongoDB:", error);
            throw error;
        }
    }

    public getConnectionStatus(): boolean {
        return this.isConnected;
    }
}

export default DatabaseConnection.getInstance();
