const sqlite= require('sqlite3')
const db= new sqlite.Database('courts.db')

const createUserTable= `CREATE TABLE IF NOT EXISTS USER (id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL, 
email TEXT NOT NULL UNIQUE,
password TEXT NOT NULL,
ISADMIN INT)`

const createCourtsTable  = `CREATE TABLE IF NOT EXISTS COURTS(
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL,
location TEXT NOT NULL,
price INTEGER NOT NULL,
phonenum TEXT NOT NULL,
court_amenities TEXT NOT NULL)`

