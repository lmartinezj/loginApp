
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const bcrypt = require('bcrypt')
import fetch from "node-fetch"


const app = express()

const users = []

app.set('view-engine', 'ejs')
app.use(express.urlencoded( { extended: false } ))
app.use(express.static('public')) // Define the location of public files js css img

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
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));

    /*
    res.json(
        {
            "id_token": "eyJraWQiOiJ7XCJwcm92aWRlcl90eXBlXCI6XCJkYlwiLFwiYWxpYXNcIjpcImJpbmRpZC1vaWRjLWp3dC1zaWduaW5nLWtleVwiLFwidHlwZVwiOlwibG9jYWxcIixcInZlcnNpb25cIjpcImF1dG8tZ2VuZXJhdGVkX2JpbmRpZFwifSIsInR5cCI6IkpXVCIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiT1hiaTRMcWx4YjU5UzVPbFN2emxIZyIsInN1YiI6IjFhZDg5MDJjLTc3NjEtNGM5Ny05MDFmLTc3MjJlZjhkMDU2ZiIsIm9wIjoiaWQiLCJ2ZXIiOiIwIiwiZHNpZCI6IjczYTRjNTYxLWE2NjMtNGRhNS05NDYyLTc5MWQwODUxZTcwNyIsImFtciI6WyJ0cy5iaW5kX2lkLm1mY2EiXSwiaXNzIjoiaHR0cHM6XC9cL3NpZ25pbi5iaW5kaWQtc2FuZGJveC5pbyIsInBpZCI6ImlkcF9pbml0IiwicGFyYW1zIjp7fSwibm9uY2UiOiJudWxsIiwiYXVkIjoiNzkyY2YzYmEuNjZlMWZhYTQudGlkX2MyZTY2ZTdiLmJpbmRpZC5pbyIsImF1dGhfdGltZSI6MTY0NzIzODIzMiwiZXhwIjoxNjQ3MzI0NzI4LCJiaW5kaWRfaW5mbyI6eyJjYXBwX2xhc3RfbG9naW4iOjE2NDcyMzc0NjYsImF1dGhlbnRpY2F0aW5nX2RldmljZSI6eyJicm93c2VyX3R5cGUiOiJDaHJvbWUiLCJvc190eXBlIjoiV2luZG93cyIsIm9zX3ZlcnNpb24iOiIxMCIsImJyb3dzZXJfdmVyc2lvbiI6Ijk4LjAuNDc1OC4xMDIifSwiY2FwcF9sYXN0X2xvZ2luX2Zyb21fYXV0aGVudGljYXRpbmdfZGV2aWNlIjoxNjQ3MjM3NDY2LCJjYXBwX2ZpcnN0X2xvZ2luX2Zyb21fYXV0aGVudGljYXRpbmdfZGV2aWNlIjoxNjQ3MTQwOTY5LCJjYXBwX2ZpcnN0X2xvZ2luIjoxNjQ3MTQwOTU0LCJvcmlnaW5hdGluZ19kZXZpY2UiOnsiYnJvd3Nlcl90eXBlIjoiQ2hyb21lIiwib3NfdHlwZSI6IldpbmRvd3MiLCJvc192ZXJzaW9uIjoiMTAiLCJicm93c2VyX3ZlcnNpb24iOiI5OC4wLjQ3NTguMTAyIn19LCJpYXQiOjE2NDcyMzgzMjgsImp0aSI6IjAyMjRlZjZiLTg1MmYtNGRlYi1hM2FkLWE2N2NjMTMwNTc2MyJ9.SnmAJO7i0D-d5LkiDIGvrzv-_chVVqfFrDP6WAYgxzpvufW8v5VKO9g7smXKakBwrl3MmXpCK8gxP23aoi59DzyVV0QJnjzI714yUK7eRG8T6RPh-jgcUtE7-8v1g3HzvEwzvr7rRBt98hZEsxYXpFMhalYKVP8iLbUii-tfASwTYJJpoxofKhL6GubHUafj306kjQDvdRzHjdda19PJDpkh1ytqlXVD9-ey0d3sN1zjtkY_3T0fNiNCsOq8C0yrW_PLl-YzdI9rM59eLbdZbhYMARuAbddjgV06i-tnKPvXAft2yZwlXgpv8lRkTlEJ-lk-VKNHGdhU0Bv4yU1V4g",
            "access_token": "69nnCWoEaP-imtcrMa0OIXEOSSaLpdNzApFLQQdBCTw",
            "expires_in": 86400,
            "scope": "openid",
            "token_type": "Bearer"
        }
    )
    */

    //res.send("Auth code: " + req.cookies['authCode'] + "State: " + req.cookies['state'])    
    /*
    const clientId = '<%= process.env.CLIENT_ID %>'
    const clientSecret = '<%= process.env.CLIENT_SECRET %>'
    const redirect_uri = '<%= process.env.REDIRECT_URI%>'
                
    console.log("client_id: " + clientId);
    console.log("client_secret: " + clientSecret);
    console.log("redirect_uri: " + redirect_uri);
    
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Host", "signin.bindid-sandbox.io");
    
    var urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "authorization_code");
    urlencoded.append("code", authCode);
    urlencoded.append("redirect_uri", redirect_uri);
    urlencoded.append("client_id", clientId);
    urlencoded.append("client_secret", clientSecret);

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow',
    mode: 'no-cors'
    };

    fetch("https://signin.bindid-sandbox.io/token", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
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