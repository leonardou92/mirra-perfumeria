#!/usr/bin/env node
/*
 scripts/add_producto_id_migration.js

 Añade la columna `producto_id` a `pedido_venta_productos` si no existe,
 hace backfill desde `producto_terminado_id` cuando corresponda y crea un
 índice simple. Ejecutar con:

 DATABASE_URL="postgresql://user:pass@host:port/db" node scripts/add_producto_id_migration.js

 Nota: el script intenta ser defensivo y no falla si la tabla/columna ya existen.
*/

const { Client } = require('pg');

async function main() {
  const cn = process.env.DATABASE_URL;
  if (!cn) {
    console.error('ERROR: setea DATABASE_URL con la conexión Postgres. Ej: export DATABASE_URL="postgresql://user:pass@host:port/db"');
    process.exit(1);
  }
  const client = new Client({ connectionString: cn });
  await client.connect();
  try {
    console.log('1) Añadiendo columna producto_id si no existe...');
    await client.query(`ALTER TABLE IF EXISTS pedido_venta_productos ADD COLUMN IF NOT EXISTS producto_id integer;`);

    console.log('2) Backfill: copiar valores desde producto_terminado_id cuando producto_id is NULL');
    // Solo actualizar filas donde producto_terminado_id no es NULL y producto_id es NULL
    const resUpdate = await client.query(`UPDATE pedido_venta_productos SET producto_id = producto_terminado_id WHERE producto_id IS NULL AND producto_terminado_id IS NOT NULL RETURNING id;`);
    console.log(`   Filas actualizadas: ${resUpdate.rowCount}`);

    console.log('3) Crear índice en producto_id para mejorar consultas (si no existe)');
    // Crear índice si no existe (forma portable): crear con nombre fijo y captura error si ya existe
    try {
      await client.query(`CREATE INDEX IF NOT EXISTS idx_pv_productoid ON pedido_venta_productos(producto_id);`);
      console.log('   Índice creado o ya existía.');
    } catch (e) {
      console.warn('   No se pudo crear índice automáticamente:', e.message || e);
    }

    console.log('4) Opcional: agregar constraint FK a productos (se comenta por seguridad).');
    console.log('   Si quieres agregar FK, descomenta la sección en el script y ejecútalo cuando estés seguro.');

    console.log('\nMigración completada. Verifica con:');
    console.log("  SELECT column_name FROM information_schema.columns WHERE table_name = 'pedido_venta_productos' ORDER BY ordinal_position;");
  } catch (err) {
    console.error('Error ejecutando migración:', err);
    process.exit(2);
  } finally {
    await client.end();
  }
}

main();
