function loginHandler(event) {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    axios.post("http://localhost:3000/user/login", {email, password})
    .then((res) => {
        if(res.status === 200) {
            alert('user logged successfully');
            //console.log(res.data.message);
            window.location.href = "/expense";
        }
    })
    .catch(err => {
        console.log(err)
        //console.log(err.response.data.message);
         const msg = document.getElementById('msg');
         msg.textContent = err.response.data.message;
    })


};

