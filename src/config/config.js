const mysql = require('mysql2')
const {host, user, database, password} =require('../helpers/env')
const connection = mysql.createConnection({
    host,
    user,
    database,
    password,
})

module.exports = connection