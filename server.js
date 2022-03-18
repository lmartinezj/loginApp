if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const bcrypt = require('bcrypt')
const fetch = require('node-fetch')
const run_java = require('./java/run_java');

const app = express()

const users = []

app.set('view-engine', 'ejs')
app.use(express.urlencoded( { extended: false } ))
app.use(express.static('public')) // Define the location of public files js css img
app.use(express.static('java')) // Define the location of java files js css img

app.get('/', (req, res) => {
    console.log('code: ' + req.query.code)
    console.log('state: ' + req.query.state)
    res.cookie('authCode', req.query.code)
    res.cookie('state', req.query.state)
    res.render('index.ejs', {authCode: req.query.code})
})

app.get('/login', (req, res) => {
    res.render('login.ejs')
})

app.post('/token', (req, res) => {
    //res.send("Auth code: ")    
    const authCode = req.body.authCode
    console.log('authCode in /token request: ' + authCode)
    console.log("/token called")

    const clientId = process.env.CLIENT_ID
    const clientSecret = process.env.CLIENT_SECRET
    const redirect_uri = process.env.REDIRECT_URI

    console.log("client_id: " + clientId);
    console.log("client_secret: " + clientSecret);
    console.log("redirect_uri: " + redirect_uri);

    /*
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Host", "signin.bindid-sandbox.io");
    */

    var urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "authorization_code");
    urlencoded.append("code", authCode);
    urlencoded.append("redirect_uri", redirect_uri);
    urlencoded.append("client_id", clientId);
    urlencoded.append("client_secret", clientSecret);

    var requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Host': 'signin.bindid-sandbox.io'
        },
        body: urlencoded,
        redirect: 'follow',
        mode: 'no-cors'
    }

    fetch("https://signin.bindid-sandbox.io/token", requestOptions)
    .then(response => response.json())
    //.then(result => res.json(result))
    .then(result => {
        console.log(result)
        const myToken = JSON.stringify(result)
        res.render('token.ejs', { token: myToken })
    })
    .catch(error => console.log('error', error))

})

app.post('/session-feedback', (req, res) => {
    //res.send("Auth code: ")    
    console.log('this is POST /session-feedback')

    const token = req.body.token
    console.log("req.body.token: " + token)
    const myJSON = JSON.parse(token)

    var requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Host': 'lmartinez-feedbackapp.herokuapp.com'
        },
        body: myJSON,
        redirect: 'follow',
        mode: 'no-cors'
    }
    
    fetch("https://lmartinez-feedbackapp.herokuapp.com/feedback", 
    requestOptions)
    .then(response => {
        response.replace('"', "'")
        response.json()
    })
    //.then(result => res.json(result))
    .then(result => {
        console.log(result)
        const myToken = JSON.stringify(result)
        result.send(myToken)
    })
    .catch(error => console.log('error', error))
    
    /*
    const token = req.body.token
    console.log('ACCESS_TOKEN in //session-feedback request: ' + token)
    console.log("/session-feedback called")

    const accessToken = process.env.CLIENT_ID
    const clientSecret = process.env.CLIENT_SECRET
    const redirect_uri = process.env.REDIRECT_URI

    console.log("access_token: " + token);
    console.log("bindid_alias: " + clientSecret);
    console.log("authentication_time: " + redirect_uri);
    console.log("feedback_auth_value: " + redirect_uri);

    /*
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Host", "signin.bindid-sandbox.io");
    */
    /*
    var urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "authorization_code");
    urlencoded.append("code", authCode);
    urlencoded.append("redirect_uri", redirect_uri);
    urlencoded.append("client_id", clientId);
    urlencoded.append("client_secret", clientSecret);

    var requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Host': 'signin.bindid-sandbox.io'
        },
        body: urlencoded,
        redirect: 'follow',
        mode: 'no-cors'
    }

    fetch("https://signin.bindid-sandbox.io/token", requestOptions)
    .then(response => response.json())
    //.then(result => res.json(result))
    .then(result => {
        console.log(result)
        const myToken = JSON.stringify(result)
        res.render('token.ejs', { token: myToken })
    })
    .catch(error => console.log('error', error))
    */

})






/*
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