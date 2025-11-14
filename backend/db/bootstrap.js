import { pool } from "./drizzle.js";

export async function atomicBootstrapAndCreateAdmin(uid, email, name) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    const lockResult = await client.query(
      `INSERT INTO system_config (key, value) 
       VALUES ('bootstrap_lock', 'in_progress')
       ON CONFLICT (key) DO NOTHING
       RETURNING *`
    );

    if (lockResult.rows.length === 0) {
      await client.query('ROLLBACK');
      console.warn('Bootstrap already in progress or completed - lock acquisition failed');
      return { success: false, reason: 'bootstrap_completed' };
    }

    const adminResult = await client.query(
      'INSERT INTO admins (firebase_uid, email, name) VALUES ($1, $2, $3) RETURNING *',
      [uid, email, name]
    );

    await client.query(
      `UPDATE system_config SET value = 'completed', updated_at = CURRENT_TIMESTAMP 
       WHERE key = 'bootstrap_lock'`
    );

    await client.query('COMMIT');
    
    console.log(`✅ First admin created atomically: ${adminResult.rows[0].email}`);
    console.log(`🔒 Bootstrap completed - endpoint /api/auth/create-admin is now permanently disabled`);
    
    return { success: true, admin: adminResult.rows[0] };
  } catch (err) {
    await client.query('ROLLBACK');
    
    if (err.code === '23505') {
      console.error('Admin already exists with this Firebase UID');
      return { success: false, reason: 'duplicate_admin', error: err };
    }
    
    console.error('Atomic bootstrap failed (recoverable):', { message: err.message, code: err.code });
    return { success: false, reason: 'db_error', error: err };
  } finally {
    client.release();
  }
}

async function createSystemConfigTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS system_config (
      key VARCHAR(255) PRIMARY KEY,
      value TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ System config table created');
}
