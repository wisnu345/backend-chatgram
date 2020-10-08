require('dotenv').config()

module.exports = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.PORT,
    USEREMAIL: process.env.USERMAIL,
    USERPASS: process.env.USERPASS,
    SECRETKEY: process.env.SECRETKEY,
    HOSTURL: process.env.HOSTURL
}