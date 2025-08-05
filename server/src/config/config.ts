import dotenv from "dotenv";
import logger from "../utils/logger";
import fs from "fs";

if (fs.existsSync(".env")) {
    logger.debug("Using .env file to supply config environment variables");
    dotenv.config({ path: ".env" });
} else {
    logger.debug("No .env file found, using environment variables or defaults");
}

interface Config {
    PORT: number;
    NODE_ENV: string;
    MONGO_URI: string;
    SESSION_SECRET?: string;
    JWT_SECRET?: string;
}

class ConfigService {
    private config: Config;

    constructor() {
        this.config = this.loadConfig();
        this.validateConfig();
    }

    private loadConfig(): Config {
        return {
            PORT: Number(process.env.PORT) || 3000,
            NODE_ENV: process.env.NODE_ENV || "development",
            MONGO_URI: process.env.MONGO_URI || "",
            SESSION_SECRET: process.env.SESSION_SECRET,
            JWT_SECRET: process.env.JWT_SECRET
        };
    }

    private validateConfig(): void {
        const requiredVars = ['MONGO_URI'];
        const missingVars = requiredVars.filter(key => !this.config[key as keyof Config]);

        if (missingVars.length > 0) {
            logger.error(`Missing required environment variables: ${missingVars.join(", ")}`);
            process.exit(1);
        }

        // Warn about missing optional but recommended variables
        const recommendedVars = ['SESSION_SECRET', 'JWT_SECRET'];
        const missingRecommended = recommendedVars.filter(key => !this.config[key as keyof Config]);

        if (missingRecommended.length > 0) {
            logger.warn(`Missing recommended environment variables: ${missingRecommended.join(", ")}`);
        }
    }

    public get<K extends keyof Config>(key: K): Config[K] {
        return this.config[key];
    }

    public getAll(): Config {
        return { ...this.config };
    }

    public isDevelopment(): boolean {
        return this.config.NODE_ENV === "development";
    }

    public isProduction(): boolean {
        return this.config.NODE_ENV === "production";
    }

    public isTest(): boolean {
        return this.config.NODE_ENV === "test";
    }
}

export default new ConfigService();
