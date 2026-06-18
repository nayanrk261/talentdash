import 'dotenv/config';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL!.replace(/^"|"$/g, '');
console.log('CS:', connectionString);
const pool = new Pool({ connectionString });
pool.query('SELECT 1').then(res => {
  console.log('Success:', res.rows);
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
