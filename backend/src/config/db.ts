import { DataSource } from "typeorm";

export const dataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST ?? "db",
  port: process.env.POSTGRES_PORT ? Number(process.env.POSTGRES_PORT) : 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: ["src/entities/*.ts"],
  migrations: ["migrations/*.ts"],
  migrationsRun: process.env.POSTGRES_SYNC !== "TRUE", // Exécute les migrations seulement si synchronize est false
  migrationsTableName: "_migrations",
  synchronize: process.env.POSTGRES_SYNC === "TRUE", // Synchronize seulement en développement
  logging: false,
});
