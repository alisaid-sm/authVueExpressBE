require('dotenv').config()
module.exports = {
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    DB_NAME: process.env.DB_NAME,
    privateKey: process.env.privateKey,
    PORT: process.env.PORT,
    EMAIL: process.env.EMAIL,
    PASSWORD_EMAIL: process.env.PASSWORD_EMAIL,
    URLFE: process.env.URLFE,
    URLBE: process.env.URLBE
};