function sendPostToken() {
    document.addEventListener("DOMContentLoaded", function() {
        var requestOptions = {
            method: 'POST',
            headers: myHeaders, //aqui voy
            body: {code: getCookie('authCode')},
            redirect: 'follow',
            mode: 'no-cors'
            };
            

            fetch("/token", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
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