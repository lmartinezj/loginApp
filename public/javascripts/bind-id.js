function sendPostToken() {
    window.addEventListener("DOMContentLoaded", function() {
        fetch('/token', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code: getCookie('authCode') })
        })
        .then(res => {
            return res.json()
        })
        .then(data => console.log(data))
        .catch(err => console.log('ERROR: ' + err.message))
    });
}

function getCookie(name) {
    let cookie = {};
    document.cookie.split(';').forEach(function(el) {
        let [k,v] = el.split('=');
        cookie[k.trim()] = v;
    })
    return cookie[name];
}

function sendAuthCodeToServer(authCode) {
    // Add code to send the authCode to your application server here
}

function handleError(err) {
    // Add code to process the authentication error here
}

window.XmBindId.processRedirectResponse()
.then(res => { 
    sendAuthCodeToServer(res.code); 
}, 
err => { 
    handleError(err); 
})