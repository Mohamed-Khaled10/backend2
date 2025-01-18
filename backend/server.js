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
server.post('/user/login', (req, res) => {
    const email = req.body.email
    const password = req.body.password
    db.get(`SELECT * FROM USER WHERE email=?  `, [email], (err, row) => {
        bcrypt.compare(password, row.PASSWORD, (err, isMatch) => {
            if (err) {
                return res.status(500).send('password doesnt match.')
            }
            if (!isMatch) {
                return res.status(401).send('invalid credentials')
            }
            else {
                let userid = row.id
                let is_admin = row.is_admin
                const token = generateToken(userid, is_admin)

                res.cookie('authToken', token, {
                    httpOnly: true,
                    sameSite: 'none',
                    secure:true,
                    expiresIn: '1h'
                })
                return res.status(200).json({ id: userid, admin: is_admin })
            }
        })
    })
})

server.post(`/user/register`, (req, res) => {
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).send('error hashing password')
        }
        db.run(`INSERT INTO USER (name,email,password,is_admin) VALUES (?,?,?,?)`, [name, email, hashedPassword, 0], (err) => {
            if (err) {

                return res.status(401).send(err)
            }
            else
                return res.status(200).send(`registration successfull`)
        })
    })
})

server.post(`/court/addcourt`, verifyToken, (req, res) => {
    const is_admin = req.userDetails.is_admin;
    if (is_admin !== 1)
        return res.status(403).send("invalid admin registration")
    const name = req.body.name
    const location = req.body.location
    const price = req.body.price
    const phonenum = req.body.phonenum
    const court_amenities = req.body.court_amenities
    let query = `INSERT INTO COURT (name,location,price,phonenum,court_amenities) VALUES
    (?,?,?,?,?)`
    db.run(query, [name, location, price, phonenum, court_amenities], (err) => {
        if (err) {
            console.log(err)
            return res.send(err)
        }
        else {
            return res.send(`court added successfully`)
        }
    })

})
server.get(`/court`, verifyToken, (req, res) => {
    const is_admin = req.userDetails.is_admin;
    if (is_admin !== 1)
        return res.status(403).send("invalid admin registration")
    const query = `SELECT * FROM COURT`
    db.all(query, (err, rows) => {
        if (err) {
            console.log(err)
            return res.send(err)
        }
        else {
            return res.json(rows)
        }
    })
})

server.get(`/court/search/:id`, (req, res) => {
    const query = `SELECT * FROM COURT WHERE ID=${req.params.id}`
    db.get(query, (err, row) => {
        if (err) {
            console.log(err)
            return res.send(err)
        }
        else if (!row)
            return res.send(`court with id ${req.params.id} not found`)
        else
            return res.send(row)
    })
})

server.put(`/court/edit/:id/:quantity`, verifyToken, (req, res) => {
    const is_admin = req.userDetails.is_admin;
    if (is_admin !== 1)
        return res.status(403).send("you are not an admin")
    const query = `UPDATE COURT SET QUANTITY=${parseInt(req.params.quantity, 10)}
    WHERE ID=${req.params.id}`

    db.run(query, (err) => {
        if (err) {
            console.log(err)
            return res.send(err)
        }
        else {
            return res.send(`court updated successfully`)
        }
    })
})

server.listen(port, () => {
    console.log(`server started at port ${port}`)
    db.serialize(() => {
        db.run(db_access.createUserTable, (err) => {
            if (err)
                console.log("error creating user table " + err)
        });
        db.run(db_access.createCourtTable, (err) => {
            if (err)
                console.log("error creating court table " + err)
        });
        db.run(db_access.createBookingTable, (err) => {
            if (err)
                console.log("error creating booking table " + err)
        });
    })



})