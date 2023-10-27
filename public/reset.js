


function sendLoginLinkHandler(e) {

    e.preventDefault();
    const email = e.target.email.value;
    //console.log(email);
   

    axios.post("http://localhost:3000/password/forgotpassword", {email} )
    .then((response) => {
        //console.log(response);
        const msg = document.getElementById('msg');
        msg.textContent = 'Link sent';

    })
    .catch(err => console.log(err));
}