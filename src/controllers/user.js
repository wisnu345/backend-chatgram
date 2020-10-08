const { success, failed, successLogin } = require("../helpers/response")
const env = require("../helpers/env")
const sendMail = require("../helpers/mail")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userModel = require('../models/user')

const users = {
    register: async (req, res) => {
        try {
            const data = req.body
            const password = req.body.password
            const salt = await bcrypt.genSalt(10)
            const generate = await bcrypt.hash(password, salt)
            const img = "404P.png"
            userModel.register(data, generate, img)
                .then(() => {
                    const email = data.email
                    success(res, [], 'Please check your email to activation')
                    const token = jwt.sign({ email: data.email }, env.SECRETKEY)
                    sendMail(email, token)
                }).catch((err) => {
                    if (err.message = 'Duplicate entry') {
                        failed(res, [], 'User Already Exist')
                    }
                })
        } catch (err) {
            failed(res, [], 'Server Internal Error')
        }
    },
    login: (req, res) => {
        try {
            const body = req.body
            userModel.login(body)
                .then(async (result) => {
                    if (!result[0]) {
                        failed(res, [], "Email invalid")
                    } else {
                        const data = result[0]
                        const pass = data.password
                        const password = req.body.password
                        const isMatch = await bcrypt.compare(password, pass)
                        if (data.status === 0) {
                            failed(res, [], "Please check your email to activation")
                        } else {
                            if (!isMatch) {
                                failed(res, [], "Password invalid")
                            } else {
                                const id = result[0].id_user
                                const name = result[0].username
                                const token_user = result[0].refreshToken
                                const token = jwt.sign({ id: id}, env.SECRETKEY, { expiresIn: 36000 })
                                const refresh = jwt.sign({ id: id }, env.SECRETKEY)
                                if (!token_user) {
                                    userModel.loginToken(refresh, id)
                                        .then((result) => {
                                            successLogin(res, name, token, refresh, 'success login')
                                        })
                                } else {
                                    successLogin(res, name, token, token_user, 'success login')
                                }
                            }
                        }
                    }
                }).catch((err) => {
                    failed(res, [], err.message)
                })
        } catch (err) {
            failed(res, [], 'Server Internal Error')
        }
    },
    verify: (req, res) => {
        try {
            const token = req.params.token
            jwt.verify(token, env.SECRETKEY, (err, decode) => {
                if (err) {
                    res.render('404')
                } else {
                    const data = jwt.decode(token)
                    const email = data.email
                    userModel.update(email).then((result) => {
                        res.render('index', { email })
                    }).catch(err => {
                        res.render('404')
                    })
                }
            })
        } catch (err) {
            failed(res, [], 'Server Internal Error')
        }
    },
    updateUser: (req, res) => {
        try {
            const body = req.body
            upload.single('image')(req, res, (err) => {
                if (err) {
                    if (err.code === `LIMIT_FIELD_VALUE`) {
                        failed(res, [], `Image size is to big`)
                    } else {
                        failed(res, [], err)
                    }
                } else {
                    const id = req.params.id
                    userModel.getOne(id)
                        .then((response) => {
                            const imageOld = response[0].image
                            body.image = !req.file ? imageOld : req.file.filename
                            if (body.image !== imageOld) {
                                if (imageOld !== '404P.png') {
                                    fs.unlink(`src/img/${imageOld}`, (err) => {
                                        if (err) {
                                            failed(res, [], err.message)
                                        } else {
                                            userModel.updateUser(body, id)
                                                .then((result) => {
                                                    success(res, result, 'Update success')
                                                })
                                                .catch((err) => {
                                                    failed(res, [], err.message)
                                                })
                                        }
                                    })
                                } else {
                                    userModel.updateUser(body, id)
                                        .then((result) => {
                                            success(res, result, 'Update success')
                                        })
                                        .catch((err) => {
                                            failed(res, [], err.message)
                                        })
                                }
                            } else {
                                userModel.updateUser(body, id)
                                    .then((result) => {
                                        success(res, result, 'Update success')
                                    })
                                    .catch((err) => {
                                        failed(res, [], err.message)
                                    })
                            }
                        })
                }
            })
        } catch (err) {
            failed(res, [], 'Server Internal Error')
        }
    }
}

module.exports = users