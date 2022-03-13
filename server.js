
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
    res.cookie('authCode', req.query.code)
    res.cookie('state', req.query.state)
    res.render('index.ejs')
})

app.get('/login', (req, res) => {
    res.render('login.ejs', {name: 'luis'})
})

app.post('/token', (req, res) => {
    res.send("Auth code: ")    
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