function loginHandler(event) {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    axios.post("/login", { email, password })
        .then((res) => {
            if (res.status === 200) {
                //console.log(res.data);
                alert('login successfull');
                localStorage.setItem('token', res.data.token);
                //console.log(res.data.message);
                window.location.href = "/expense";
            }
            else {
                alert('incorrect password');
            }
        })
        .catch(err => {
            console.log(err)
            //console.log(err.response.data.message);
            const msg = document.getElementById('msg');
            msg.textContent = err.response.data.message;
        })


};

