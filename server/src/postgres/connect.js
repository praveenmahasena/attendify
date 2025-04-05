import pg from 'pg'


const connection = new pg.Client({
  user: process.env.DB_USR,
  password: process.env.DB_PASSWORD,
  host:process.env.DB_HOST,
  port:process.env.DB_PORT,
  database:process.env.DB_NAME,
})

export default connection;
