function loginHandler(event) {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    axios.post("http://localhost:3000/login/user", {email, password})
    .then((res) => {
        if(res.status === 200) {
            alert(res.data);
        }
    })
    .catch(err => {
        console.log(JSON.stringify(err))
        const msg = document.getElementById('msg');
        msg.textContent = err.message;
    })

};