function saveToDb(event) {
    event.preventDefault();
    const form = document.getElementById('addForm');

    const amount = event.target.amount.value;
    const category = event.target.category.value;
    const description = event.target.description.value;
    
    expenseDetail = {
        amount,
        category,
        description
    };
    const token = localStorage.getItem('token');
    console.log(token);
    //console.log(userDetail);
    axios.post("http://localhost:3000/expense/addexpense", expenseDetail, {headers: {"Authorization": token}})
    .then((expense) => {
        form.reset();
        showExpense(expense.data);
    })
    .catch(err => console.log(err));
};

function showExpense(expense) {
    const parentElement = document.getElementById('items');

    const childElement = document.createElement('li');
    childElement.className = 'list-group-item';
    //childElement.appendChild(document.createTextNode(`Amount-${expense.amount} ; Category-${expense.category} ; Description:${expense.description}`));
    childElement.innerHTML = `Amount: <b>Rs ${expense.amount}</b>  ; Category: <b>${expense.category}</b> ; Description: <b>${expense.description}</b>`;
    const delbtn = document.createElement('button');
    delbtn.textContent = "DELETE";
    delbtn.className = 'btn btn-danger btn-sm float-right';

    childElement.appendChild(delbtn);
    //console.log(childElement);

    parentElement.appendChild(childElement);
    //console.log(parentElement);

    delbtn.addEventListener('click', (event) => {
         event.stopPropagation();
        const id = expense.id;

        axios.delete(`http://localhost:3000/expense/addexpense/${id}`)
        .then((res) => {
            parentElement.removeChild(childElement);
        })
        .catch(err => console.log(err));
    });

}   


document.getElementById('rzp-btn1').onclick = async function(e) {
    const token = localStorage.getItem('token');
    const response = await axios.get("http://localhost:3000/purchase/premiummembership", {headers: {"Authorization": token}})
    //console.log(response)

    var options = {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        // handler hanldes the success payment
        "handler": async function(response) {
            console.log(response);
            await axios.post("http://localhost:3000/purchase/updatetransactionstatus", {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id 
            }, {headers: {"Authorization": token}})
            alert('You are a premium user now')
            window.location.href = "/expense";

        },
    };

    const rzp1 = new Razorpay(options)
    rzp1.open();
    e.preventDefault()
    rzp1.on('payment.failed', function(response){
        console.log(response);
        alert('Something went wrong');
    });
};

    


window.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem('token');
    axios.get("http://localhost:3000/expense/addexpense", {headers: {"Authorization": token}})
    .then((response) => {
        //console.log(response.data)
        //console.log(response.data.expenses[0]);
        const isPremium = response.data.user.isPremiumUser
        if(isPremium){
            btn = document.getElementById('rzp-btn1');
            btn.style.display = 'none';
            document.getElementById('premium-status').style.display = 'block';
        }
        
        for(var i=0; i<response.data.expenses.length; i++ ){
            showExpense(response.data.expenses[i]);
        }
    } )
    .catch(err => console.log(err));
})

