function loginHandler(event) {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    axios.post("http://localhost:3000/login/user", {email, password})
    .then((res) => {
        if(res.status === 200) {
            alert(res.data.message);
            // console.log(res.data.message);
        }
    })
    .catch(err => {
        console.log(err)
        //console.log(err.response.data.message);
         const msg = document.getElementById('msg');
         msg.textContent = err.response.data.message;
    })

};