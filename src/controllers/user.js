const usersModels = require('../models/user');
const { success, failed, successToken } = require('../helper/response');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { privateKey , URLFE, URLBE } = require('../helper/env');
const nodemailer = require('nodemailer');
const env = require('../helper/env');

const users = {
    register: async (req, res) => {
        try {
            const data = req.body;
            const salt = await bcrypt.genSaltSync(10);
            const hash = await bcrypt.hashSync(data.password, salt);
            // console.log(hash)
            const dataNew = {
                email: data.email,
                password: hash
            };
            usersModels.register(dataNew)
                .then((result) => {
                    const token = jwt.sign({ email: data.email }, privateKey);
                    const output = `
                    <center><h3>Hello ${data.email}</h3>
                    <h3>Thank you for registration</h3>
                    <p>You can confirm your email by clicking the link below <br> <a href="http://${URLBE}/api/v1/user/active/${token}">Activation</a></p></center>
                    `;
                    let transporter = nodemailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 587,
                        secure: false,
                        requireTLS: true,
                        auth: {
                            user: env.EMAIL,
                            pass: env.PASSWORD_EMAIL
                        }
                    });
    
                    let Mail = {
                        from: `"POS-APP" <${env.EMAIL}>`,
                        to: data.email,
                        subject: 'Verification Email',
                        text: 'Plaintext version of the message',
                        html: output
                    };
    
                    transporter.sendMail(Mail);
                    success(res, result, 'Please check your email to activation');
                })
                .catch((err) => {
                    if (err.message === 'Duplicate entry') {
                        failed(res, [], 'Email Already Exist');
                    } else {
                        failed(res, [], err.message);
                    }
                });
        } catch (error) {
            failed(res, [], 'internal server error');
        }

    },
    active: (req, res) => {
        try {
            const token = req.params.token;
            jwt.verify(token, privateKey, (err, decode) => {
                if (err) {
                    failed(res, [], 'Failed authorization!');
                } else {
                    const data = jwt.decode(token);
                    const email = data.email;
                    usersModels.updateUser(email).then(() => {
                        res.render('index', { email, link: `http://${URLFE}` });
                    }).catch(err => {
                        failed(res, [], err.message);
                    });
                }
            });
        } catch (error) {
            failed(res, [], 'Internal Server Error');
        }
    },
    login: async (req, res) => {
        try {
            const data = req.body;
            usersModels.login(data)
                .then( async (result) => {
                    const results = result[0];
                    if (!results) {
                        failed(res, [], 'Email not registered, Please register!');
                    } else {
                        const match = await bcrypt.compare(data.password, results.password);
                        if (match) {
                            if (results.actived === 'yes') {
                                jwt.sign({ email: results.email }, privateKey, { expiresIn: 3600},
                                    (err, token) => {
                                        if (err) {
                                            failed(res, [], err.message);
                                        } else {
                                            const id = results.id;
                                            const refreshToken = jwt.sign({id}, 'REFRESH TOKEN 123');
                                            usersModels.updateRefreshToken(refreshToken, id)
                                                .then(() => {
                                                    const data = {
                                                        token,
                                                        refreshToken
                                                    };
                                                    successToken(res, data, 'login success');
                                                })
                                                .catch((err) => {
                                                    console.log(err);
                                                });
                                        }
                                    }
                                );
                            } else {
                                failed(res, [], 'Activation needed!');
                            }
                        } else {
                            failed(res, [], 'password salah');
                        }
                    }
                });
        } catch (error) {
            failed(res, [], 'internal server error');
        }
    },
    renewToken: (req, res) => {
        const refreshToken = req.body.refreshToken;
        usersModels.checkRefreshToken(refreshToken)
            .then((result) => {
                if (result.length >= 1) {
                    //const user = result[0];
                    const newToken = jwt.sign({ email: result.email }, privateKey, { expiresIn: 3600});
                    const data = {
                        token: newToken,
                        refreshToken
                    };
                    successToken(res, data, 'Refresh Token Success');
                } else {
                    failed(res, [], 'Refresh Token Not Found');
                }
            });

    },
    resendActivation: (req, res) => {
        const email = req.body.email
        const token = jwt.sign({ email: email }, privateKey);
        const output = `
        <center><h3>Hello ${email}</h3>
        <h3>Thank you for registration</h3>
        <p>You can confirm your email by clicking the link below <br> <a href="http://${URLBE}/api/v1/user/active/${token}">Activation</a></p></center>
        `;
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: env.EMAIL,
                pass: env.PASSWORD_EMAIL
            }
        });

        let Mail = {
            from: `"alisaid" <${env.EMAIL}>`,
            to: email,
            subject: 'Verification Email',
            text: 'Plaintext version of the message',
            html: output
        };

        transporter.sendMail(Mail);
        success(res, [], 'activation link was sent on your email');
    },
    profile: (req, res) => {
        const email = req.params.email
        usersModels.profile(email)
         .then((result) => {
             success(res, result, 'get profile success')
         })
         .catch((err) => {
             failed(res, [], err.message)
         })
    }
};

module.exports = users;