import database from 'infra/database.js';

async function status(request, response) {
  const updatedAt = new Date().toISOString();
  const databaseVersion = await database.query('SHOW server_version;');
  const postgresMaxConnections = await database.query('SHOW max_connections;');

  const databaseName = process.env.POSTGRES_DB;
  const postgresOpenedConnections = await database.query({
    text: 'SELECT count (*)::int FROM pg_stat_activity WHERE datname = $1;',
    values: [databaseName],
  });
  //"SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = 'local_db';",
  //const dat = await database.query('SELECT current_database()');
  //console.log(dat.rows[0].current_database);

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersion.rows[0].server_version,
        max_connection: postgresMaxConnections.rows[0].max_connections,
        opened_connections: postgresOpenedConnections.rows[0].count,
      },
    },
  });
}

export default status;
