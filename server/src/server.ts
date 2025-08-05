import { createServer } from "./app";
import config from "./config/config";
import logger from "./utils/logger";
import database from "./config/database";

const main = async () => {
    try {
        const app = await createServer();
        const PORT = config.get("PORT");

        const server = app.listen(PORT, () => {
            logger.info(`🚀 Server is running on port ${PORT} in ${config.get("NODE_ENV")} mode`);
        });

        // Graceful shutdown handlers
        const gracefulShutdown = async (signal: string) => {
            logger.info(`${signal} received. Starting graceful shutdown...`);

            server.close(async () => {
                logger.info("HTTP server closed");

                try {
                    await database.disconnect();
                    logger.info("Database connection closed");
                    process.exit(0);
                } catch (error) {
                    logger.error("Error during database shutdown:", error);
                    process.exit(1);
                }
            });
        };

        // Handle different shutdown signals
        process.on("SIGINT", () => gracefulShutdown("SIGINT"));
        process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

        process.on("uncaughtException", (err) => {
            logger.error("Uncaught Exception:", err);
            server.close(async () => {
                await database.disconnect();
                process.exit(1);
            });
        });

        process.on("unhandledRejection", (reason) => {
            logger.error("Unhandled Rejection:", reason);
            server.close(async () => {
                await database.disconnect();
                process.exit(1);
            });
        });

    } catch (error) {
        logger.error("Failed to start server:", error);
        process.exit(1);
    }
};

main();