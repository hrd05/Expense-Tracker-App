
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

    // console.log(expenseDetail);


    axios.post("/expense/addexpense", expenseDetail, { headers: { "Authorization": token } })
        .then((res) => {
            form.reset();
            // console.log(res);
            const parentElement = document.getElementById('items');

            const childElement = document.createElement('li');
            childElement.className = 'list-group-item';
            //childElement.appendChild(document.createTextNode(`Amount-${expense.amount} ; Category-${expense.category} ; Description:${expense.description}`));
            childElement.innerHTML = `Amount: <b>Rs ${res.data.amount}</b>  ; Category: <b>${res.data.category}</b> ; Description: <b>${res.data.description}</b>`;
            const delbtn = document.createElement('button');
            delbtn.textContent = "DELETE";
            delbtn.className = 'btn btn-danger btn-sm float-right';

            childElement.appendChild(delbtn);

            parentElement.appendChild(childElement);
            // showExpense(expense.data);

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
            // console.log('hii');
            const id = expense._id;
            axios.delete(`/expense/addexpense/${id}`, { headers: { "Authorization": token } })
                .then((res) => {
                    parentElement.removeChild(childElement);
                })
                .catch(err => console.log(err));
        })
    })

}


document.getElementById('rzp-btn1').onclick = async function (e) {

    const response = await axios.get("/purchase/premiummembership", { headers: { "Authorization": token } })
    //console.log(response)

    var options = {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        // handler hanldes the success payment
        "handler": async function (response) {

            await axios.post("/purchase/updatetransactionstatus", {
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
    axios.get('/user/download', { headers: { "Authorization": token } })
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
    axios.post("/user/download", downloadHistory)
        .then((response) => {
            //console.log('ll');
            // console.log(response);
        })
        .catch(err => console.log(err));
}

function setExpensesPerPage() {

    const selectedValue = selectElement.value;

    localStorage.setItem('expensesPerPage', selectedValue);
    location.reload();

}

window.addEventListener("DOMContentLoaded", () => {
    const pageSize = localStorage.getItem('expensesPerPage');
    selectElement.value = pageSize;
    // selectElement.value = pageSize
    const page = 1;
    axios.get(`/expenses?page=${page}&pageSize=${pageSize}`, { headers: { "Authorization": token } })
        .then((res) => {
            const isPremium = res.data.isPremiumx
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
    previousPage
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
    axios.get(`/expenses?page=${page}&pageSize=${pageSize}`, { headers: { "Authorization": token } })
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
    axios.get("/purchase/showleaderboard", { headers: { "Authorization": token } })
        .then((res) => {
            console.log(res.data);
            for (var i = 0; i < res.data.length; i++) {
                showTotalAmount(res.data[i]);
            }
        })
        .catch(err => console.log(err));
}

function showTotalAmount(leaderboard) {
    const parentElement = document.getElementById('leaderboard');
    const childElement = document.createElement('li');
    childElement.className = 'list-group-item';

    childElement.textContent = `Name: ${leaderboard.username} , Total expenses: Rs ${leaderboard.totalExpense}`
    parentElement.appendChild(childElement);
}

function showDownloadHistory() {
    table1.style.display = 'block';
    axios.get("/user/downloadhistory", { headers: { "Authorization": token } })
        .then((response) => {
            for (var i = 0; i < response.data.length; i++) {
                showdownloadDetails(response.data[i]);
            }

        })
        .catch(err => console.log(err));

}



function showdownloadDetails(downloadhistory) {
    const row = document.createElement('tr');

    const date = downloadhistory.createdAt;
    const dateObject = new Date(date);
    const formatDate = dateObject.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    })
    const fileUrlCell = document.createElement('td');
    fileUrlCell.innerHTML = `<a href=${downloadhistory.fileUrl}>myexpense/${downloadhistory.createdAt}</a>`;

    const dateCol = document.createElement('td');
    dateCol.textContent = formatDate

    row.appendChild(fileUrlCell);
    row.appendChild(dateCol);

    tableBody.appendChild(row);

}