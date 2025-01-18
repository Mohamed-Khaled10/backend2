const sqlite= require('sqlite3')
const db= new sqlite.Database('courts.db')

const createUserTable= `CREATE TABLE IF NOT EXISTS USER(
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL, 
email TEXT NOT NULL UNIQUE,
password TEXT NOT NULL,
is_admin INT DEFAULT 0 CHECK (is_admin IN (0, 1))`

const createCourtTable  = `CREATE TABLE IF NOT EXISTS COURT(
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL,
location TEXT NOT NULL,
price REAL NOT NULL,
phonenum TEXT NOT NULL,
court_amenities TEXT NOT NULL,
quantity INT NOT NULL)`

const createBookingTable  = `CREATE TABLE IF NOT EXISTS BOOKING(
id INTEGER PRIMARY KEY AUTOINCREMENT,
user_id INT NOT NULL,
court_id INT NOT NULL,
time TEXT NOT NULL,
date TEXT NOT NULL,
FOREIGN KEY (user_id) REFERENCES USER(id),
FOREIGN KEY (court_id) REFERENCES COURT(id))`

module.exports={db,createUserTable,createCourtTable,createBookingTable}

