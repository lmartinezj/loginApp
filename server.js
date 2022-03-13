
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')

const users = []

app.set('view-engine', 'ejs')
app.use(express.urlencoded( { extended: false } ))

app.get('/', (req, res) => {
    console.log('code: ' + req.query.code)
    console.log('state: ' + req.query.state)
    res.render('index.ejs', { code: req.query.code })
})

app.get('/login', (req, res) => {
    res.render('login.ejs')
})
/*
app.post('/login', (req, res) => {
    //res.render('login.ejs')
})

app.get('/register', (req, res) => {
    res.render('register.ejs')
})

app.post('/register', async(req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            password: hashedPassword
        })
        res.redirect('/login')
    } catch (error) {
        console.log(error)
        res.redirect('/register')
    }
    console.log(users)
})
*/
app.listen(process.env.PORT || 3000)