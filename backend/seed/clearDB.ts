import { dataSource } from "../src/config/db";

(async () => {
  await dataSource.initialize();

  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();

  try {
    // Désactiver les contraintes de clés étrangères
    await queryRunner.query("SET session_replication_role = replica;");

    // Supprimer toutes les tables dans l'ordre inverse des dépendances
    const tables = await queryRunner.query(`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename NOT LIKE 'pg_%' 
      AND tablename != 'information_schema'
      AND tablename != '_migrations'
    `);

    for (const table of tables) {
      await queryRunner.query(
        `DROP TABLE IF EXISTS "${table.tablename}" CASCADE`
      );
    }

    // Supprimer tous les types d'enum avec CASCADE
    const enums = await queryRunner.query(`
      SELECT typname FROM pg_type 
      WHERE typtype = 'e' 
      AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
    `);

    for (const enumType of enums) {
      await queryRunner.query(
        `DROP TYPE IF EXISTS "${enumType.typname}" CASCADE`
      );
    }

    // Supprimer la table de migrations si elle existe
    await queryRunner.query(`DROP TABLE IF EXISTS "_migrations" CASCADE`);

    // Réactiver les contraintes
    await queryRunner.query("SET session_replication_role = DEFAULT;");

    console.log("✅ Database cleared successfully.");
  } catch (error) {
    console.error("❌ Error clearing database:", error);
    throw error;
  } finally {
    await queryRunner.release();
  }

  process.exit(0);
})();
