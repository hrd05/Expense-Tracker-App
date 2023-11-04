

const leaderBtn = document.getElementById('slbtn2');
const token = localStorage.getItem('token');
const downbtn = document.getElementById('downloadbtn');
const tableBody = document.getElementById('table-body');
const table = document.getElementById('table1');
const pagination = document.getElementById('pagination');
const selectElement = document.getElementById("expensesPerPage");

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

    //console.log(userDetail);
    axios.post("http://16.171.47.193:3000/expense/addexpense", expenseDetail, { headers: { "Authorization": token } })
        .then((expense) => {
            //console.log(expense.data[0].amount);
            const parentElement = document.getElementById('items');

        const childElement = document.createElement('li');
        childElement.className = 'list-group-item';
        //childElement.appendChild(document.createTextNode(`Amount-${expense.amount} ; Category-${expense.category} ; Description:${expense.description}`));
        childElement.innerHTML = `Amount: <b>Rs ${expense.data[0].amount}</b>  ; Category: <b>${expense.data[0].category}</b> ; Description: <b>${expense.data[0].description}</b>`;
        const delbtn = document.createElement('button');
        delbtn.textContent = "DELETE";
        delbtn.className = 'btn btn-danger btn-sm float-right';

        childElement.appendChild(delbtn);

        parentElement.appendChild(childElement);
        delbtn.addEventListener('click', (event) => {
            //event.stopPropagation();
            const id = expense.id;

            axios.delete(`http://16.171.47.193:3000/expense/addexpense/${id}`, { headers: { "Authorization": token } })
                .then((res) => {
                    parentElement.removeChild(childElement);
                })
                .catch(err => console.log(err));
        });
           
        })
        .catch(err => console.log(err));
};

function showExpense(expenses) {
    document.getElementById('items').innerHTML = "";
    

    expenses.forEach((expense) => {
        const parentElement = document.getElementById('items');

        const childElement = document.createElement('li');
        childElement.className = 'list-group-item';
        //childElement.appendChild(document.createTextNode(`Amount-${expense.amount} ; Category-${expense.category} ; Description:${expense.description}`));
        childElement.innerHTML = `Amount: <b>Rs ${expense.amount}</b>  ; Category: <b>${expense.category}</b> ; Description: <b>${expense.description}</b>`;
        const delbtn = document.createElement('button');
        delbtn.textContent = "DELETE";
        delbtn.className = 'btn btn-danger btn-sm float-right';

        childElement.appendChild(delbtn);

        parentElement.appendChild(childElement);
        delbtn.addEventListener('click', (event) => {
            //event.stopPropagation();
            const id = expense.id;

            axios.delete(`http://16.171.47.193:3000/expense/addexpense/${id}`, { headers: { "Authorization": token } })
                .then((res) => {
                    parentElement.removeChild(childElement);
                })
                .catch(err => console.log(err));
        });

    })

}


document.getElementById('rzp-btn1').onclick = async function (e) {

    const response = await axios.get("http://16.171.47.193:3000/purchase/premiummembership", { headers: { "Authorization": token } })
    //console.log(response)

    var options = {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        // handler hanldes the success payment
        "handler": async function (response) {

            await axios.post("http://16.171.47.193:3000/purchase/updatetransactionstatus", {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id
            }, { headers: { "Authorization": token } })
            alert('You are a premium user now')
            window.location.href = "/expense";

        },
    };

    const rzp1 = new Razorpay(options)
    rzp1.open();
    e.preventDefault()
    rzp1.on('payment.failed', function (response) {
        alert('Something went wrong');
    });
};


function download(filename) {
    axios.get('http://16.171.47.193:3000/user/download', { headers: { "Authorization": token } })
        .then((response) => {
            if (response.status === 201) {
               
                const fileURL = response.data.fileURL;
                const userId = response.data.userId;
                //the bcakend is essentially sending a download link
                //  which if we open in browser, the file would download
                var a = document.createElement("a");
                a.href = response.data.fileURL;
                a.download = filename;
                a.click();
                saveFileToDb(fileURL, userId);
                //console.log('download done');
            } else {
                throw new Error(response.data.message)
            }

        })
        .catch((err) => {
            console.log(err);
        });
}



function saveFileToDb(fileURL, userId) {
    const downloadHistory = {
        fileURL,
        userId
    }
    axios.post("http://16.171.47.193:3000/user/download", downloadHistory)
        .then((response) => {
            //console.log('ll');
            console.log(response);
        })
}

function setExpensesPerPage() {
    
    const selectedValue = selectElement.value;

    localStorage.setItem('expensesPerPage',  selectedValue);
    location.reload();
    
}

window.addEventListener("DOMContentLoaded", () => {
    const pageSize = localStorage.getItem('expensesPerPage');
    selectElement.value = pageSize
    const page = 1;
    axios.get(`http://16.171.47.193:3000/expenses?page=${page}&pageSize=${pageSize}`, { headers: { "Authorization": token } })
        .then((res) => {
            const isPremium = res.data.user.isPremiumUser
            checkPremium(isPremium);
            showExpense(res.data.expenses);
            showPagination(res.data);
        })
        .catch(err => console.log(err));
});

function showPagination({
    currentPage,
    hasNextPage,
    nextPage,
    hasPreviousPage,
    previousPage,
    lastPage
}) {
    pagination.innerHTML = '';

    if (hasPreviousPage) {
        const btn2 = document.createElement('button');
        btn2.innerHTML = previousPage;
        btn2.setAttribute('type', 'button');
        btn2.addEventListener('click', () => getExpenses(previousPage))
        pagination.appendChild(btn2)
    }

    const btn1 = document.createElement('button');
    btn1.innerHTML = currentPage;
    btn1.setAttribute('type', 'button');
    btn1.classList.add('current');
    btn1.addEventListener('click', () => getExpenses(currentPage))
    pagination.appendChild(btn1);

    if (hasNextPage) {
        const btn3 = document.createElement('button');
        btn3.innerHTML = nextPage;
        btn3.setAttribute('type', 'button');
        btn3.addEventListener('click', () => getExpenses(nextPage));
        pagination.appendChild(btn3);
    }
}

function getExpenses(page) {
    const pageSize = localStorage.getItem('expensesPerPage');
    axios.get(`http://16.171.47.193:3000/expenses?page=${page}&pageSize=${pageSize}`, { headers: { "Authorization": token } })
        .then((res) => {

            showExpense(res.data.expenses);
            showPagination(res.data);
        })
        .catch(err => console.log(err));
}

function checkPremium(isPremium) {
    if (isPremium) {
        btn = document.getElementById('rzp-btn1');
        downbtn.removeAttribute('disabled');
        downbtn.style.display = 'block'
        document.getElementById('premium-status').style.display = 'block';
        leaderBtn.style.display = 'block';

    } else {
        btn = document.getElementById('rzp-btn1');
        btn.style.display = 'block';
    }
}

function showLeaderboard() {
    const token = localStorage.getItem('token');
    document.getElementById('title1').style.display = 'block';
    //console.log('in function');
    axios.get("http://16.171.47.193:3000/purchase/showleaderboard", { headers: { "Authorization": token } })
        .then((leaderboard) => {
            // console.log(leaderboard.data);
            for (var i = 0; i < leaderboard.data.length; i++) {
                showTotalAmount(leaderboard.data[i]);
            }
        })
        .catch(err => console.log(err));
}

function showTotalAmount(leaderboard) {
    const parentElement = document.getElementById('leaderboard');
    const childElement = document.createElement('li');
    childElement.className = 'list-group-item';

    childElement.textContent = `Name: ${leaderboard.name} , Total expenses: Rs ${leaderboard.total_Expense}`
    parentElement.appendChild(childElement);
}

function showDownloadHistory() {
    table1.style.display = 'block';
    axios.get("http://16.171.47.193:3000/user/downloadhistory", { headers: { "Authorization": token } })
        .then((response) => {
            for (var i = 0; i < response.data.length; i++) {
                showdownloadDetails(response.data[i]);
            }

        })
        .catch(err => console.log(err));

}

function showdownloadDetails(downloadhistory) {
    const row = document.createElement('tr');

    const fileUrlCell = document.createElement('td');
    fileUrlCell.innerHTML = `<a href=${downloadhistory.fileUrl}>myexpense/${downloadhistory.createdAt}</a>`;

    const date = document.createElement('td');
    date.textContent = downloadhistory.createdAt;

    row.appendChild(fileUrlCell);
    row.appendChild(date);

    tableBody.appendChild(row);

}