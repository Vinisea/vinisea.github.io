import Sequelize from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const databaseURL = process.env.DATABASE_URL?.trim();
const usarSSL = process.env.DATABASE_SSL === "true";

export const conn = databaseURL
  ? new Sequelize(databaseURL, {
      dialect: "postgres",
      dialectOptions: usarSSL
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: true,
            },
          }
        : {},
      logging: false,
    })
  : new Sequelize({
      dialect: "sqlite",
      storage: process.env.DATABASE_STORAGE || "./database/db.sqlite",
      logging: false,
    });