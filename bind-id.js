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