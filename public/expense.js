function saveToDb(event) {
    event.preventDefault();

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
        console.log(expense);
        showExpense(expense.data);
    })
    .catch(err => console.log(err));
};

function showExpense(expense) {
    console.log('in showexpense function');
    const parentElement = document.getElementById('items');

    const childElement = document.createElement('li');
    childElement.className = 'list-group-item';
    childElement.appendChild(document.createTextNode(`Amount-${expense.amount} ; Category-${expense.category} ; description:${expense.description}`));

    const delbtn = document.createElement('button');
    delbtn.textContent = "DELETE";
    delbtn.className = 'btn btn-danger btn-sm float-right delete';

    childElement.appendChild(delbtn);
    console.log(childElement);

    parentElement.appendChild(childElement);
    console.log(parentElement);


}

window.addEventListener("DOMContentLoaded", () => {
    axios.get("http://localhost:3000/expense/addexpense")
    .then((expenses) => {
        for(var i=0; i<expenses.data.length; i++ ){
            console.log(expenses.data[i], i );
            showExpense(expenses.data[i]);
        }
    } )
    .catch(err => console.log(err));
})