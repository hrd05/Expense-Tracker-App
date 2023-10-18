function loginHandler(event) {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    axios.post("http://localhost:3000/login/user", {email, password})
    .then((res) => {
        if(res.status === 200) {
            alert('User logged Successfully');
        }
        else if (res.status(401)){
            const msg = document.getElementById('msg');
            msg.textContent = res.data;
        }
        else{
            const msg = document.getElementById('msg');
            msg.textContent = res.data;
        }
    })
    .catch(err => console.log(err));
};