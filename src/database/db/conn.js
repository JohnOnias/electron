import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function conn() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(
            path.join(__dirname, 'database.db'), 
            (err) => {
                if (err) {
                    console.error('Database connection failed:', err); 
                    reject(err);
                } else {
                    console.log('Database connected!'); 
                    resolve(db);
                }
            }
        );
    });
}