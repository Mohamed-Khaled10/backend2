const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const db_access = require('./db.js')
const db = db_access.db
const server = express()
const port = 555
const secret_key = 'mrkak789moadrtlkdvcr'
server.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}))
server.use(express.json())
server.use(cookieParser())
const generateToken = (id, is_admin) => {
    return jwt.sign({ id, is_admin }, secret_key, { expiresIn: '1h' })
}
const verifyToken = (req, res, next) => {
    const token = req.cookies.authToken
    if (!token)
        return res.status(401).send('unauthorized')
    jwt.verify(token, secret_key, (err, details) => {
        if (err)
            return res.status(403).send('invalid or expired token')
        req.userDetails = details

        next()
    })
}