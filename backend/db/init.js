import { pool } from './drizzle.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDatabase() {
  try {
    console.log('جاري الاتصال بقاعدة البيانات...');
    
    const client = await pool.connect();
    console.log('تم الاتصال بنجاح!');
    
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    
    console.log('جاري إنشاء الجداول...');
    await client.query(schema);
    console.log('تم إنشاء الجداول بنجاح!');
    
    client.release();
    
    console.log('✅ تم إعداد قاعدة البيانات بنجاح');
    process.exit(0);
  } catch (error) {
    console.error('❌ خطأ في إعداد قاعدة البيانات:', error);
    process.exit(1);
  }
}

initDatabase();
