import mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config();

export const mysqlConnection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD
})

