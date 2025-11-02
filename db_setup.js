const mysql = require('mysql2/promise');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  let connection;
  
  try {
    // Create connection without database selected
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });
    
    console.log('Connected to MySQL server');
    
    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'foodshare';
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log(`Database '${dbName}' created or already exists`);
    
    // Use the database
    await connection.query(`USE ${dbName}`);
    
    // Read SQL schema file
    const schemaPath = path.join(__dirname, 'database_schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    // Split SQL statements and execute them
    const statements = schemaSql.split(';').filter(statement => statement.trim() !== '');
    
    for (const statement of statements) {
      await connection.query(statement);
    }
    
    console.log('Database schema created successfully');
    
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

setupDatabase();