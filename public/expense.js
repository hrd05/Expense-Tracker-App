function saveToDb(event) {
    event.preventDefault();
    const form = document.getElementById('addForm');

    const amount = event.target.amount.value;
    const category = event.target.category.value;
    const description = event.target.description.value;

    userDetail = {
        amount,
        category,
        description
    };

    //console.log(userDetail);
    axios.post("http://localhost:3000/expense/addexpense", userDetail)
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

window.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem('token');
    axios.get("http://localhost:3000/expense/addexpense", {headers: {"Authorization": token}})
    .then((expenses) => {
        for(var i=0; i<expenses.data.length; i++ ){
            showExpense(expenses.data[i]);
        }
    } )
    .catch(err => console.log(err));
})