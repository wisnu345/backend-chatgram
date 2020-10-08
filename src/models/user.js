const db = require('../config/config')

const users = {
    register: (data, generate, image) => {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO users (username, email, password, image) VALUES ('${data.username}', '${data.email}', '${generate}', '${image}')`, (err, result) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },
    login: (data) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM users WHERE email = '${data.email}'`, (err, result) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },
    getall: (data) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM users`, (err, result) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },
    insertChat: (data) => {
        // console.log(data)
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO message (sender, receiver, chat) VALUES ('${data.sender}', '${data.receiver}', '${data.message}')`, (err, result) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },
    gethistoryChat: (data) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM message WHERE (sender = '${data.sender}' AND receiver = '${data.receiver}') OR (sender = '${data.receiver}' AND receiver = '${data.sender}')`, (err, result) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },
    updateKey: (key, email) => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE users SET key_pass="${key}" WHERE email="${email}"`, (err, result) => {
                if(err) {
                    reject(new Error(err))
                }else {
                    resolve(result)
                }
            })
        })
    },
    setPass: (password, key) => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE users SET password='${password}', key_pass=null WHERE key_pass='${key}'`, (err, result) => {
                if(err) {
                    reject(new Error(err))
                }else{
                    resolve(result)
                }
            })
        })
    },
    update: (email) => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE users SET status= 1 WHERE email='${email}'`, (err, result) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },
    loginToken: (token, id) => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE users SET refreshToken='${token}' WHERE id_user=${id}`, (err, result) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },
    addFriend: (data) => {
        console.log(data)
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO contacts (profile_username, friend_username) VALUES ('${data.profile}', '${data.friend}')`, (err, result) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },
    getFriend: (data) => {
        console.log(data)
        return new Promise((resolve, reject) => {
            db.query(`
            SELECT * FROM contacts LEFT JOIN users ON friend_username = username WHERE profile_username = '${data.profile}'`, (err, result) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    }
}

module.exports = users