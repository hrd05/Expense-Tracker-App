const leaderBtn = document.getElementById('slbtn2');
const token = localStorage.getItem('token');
const downbtn = document.getElementById('downloadbtn');
const tableBody = document.getElementById('table-body');
const table = document.getElementById('table1');

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
         //event.stopPropagation();
        const id = expense.id;

        axios.delete(`http://localhost:3000/expense/addexpense/${id}`, {headers: {"Authorization": token}})
        .then((res) => {
            parentElement.removeChild(childElement);
        })
        .catch(err => console.log(err));
    }); 

}   


document.getElementById('rzp-btn1').onclick = async function(e) {
    
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

    
function download(filename){
    console.log('in download');
    axios.get('http://localhost:3000/user/download', { headers: {"Authorization" : token} })
    .then((response) => {
        if(response.status === 201){
            console.log(response.data)
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
    axios.post("http://localhost:3000/user/download", downloadHistory)
    .then((response) => {
        //console.log('ll');
        console.log(response);
    })
}

window.addEventListener("DOMContentLoaded", () => {
    axios.get("http://localhost:3000/expense/addexpense", {headers: {"Authorization": token}})
    .then((response) => {
        //console.log(response.data)
        //console.log(response.data.expenses[0]);
        const isPremium = response.data.user.isPremiumUser
        if(isPremium){
            btn = document.getElementById('rzp-btn1');
            downbtn.removeAttribute('disabled');
            downbtn.style.display = 'block'
            document.getElementById('premium-status').style.display = 'block';
            leaderBtn.style.display = 'block';

        }else{
            btn = document.getElementById('rzp-btn1');
            btn.style.display = 'block';
        }
        
        for(var i=0; i<response.data.expenses.length; i++ ){
            showExpense(response.data.expenses[i]);
        }
    } )
    .catch(err => console.log(err));
});


function showLeaderboard() {
    const token = localStorage.getItem('token');
    document.getElementById('title1').style.display = 'block';
    //console.log('in function');
    axios.get("http://localhost:3000/purchase/showleaderboard", {headers: {"Authorization": token}} )
    .then((leaderboard) => {
        console.log(leaderboard.data);
        for(var i=0;i<leaderboard.data.length;i++){
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
    axios.get("http://localhost:3000/user/downloadhistory", { headers: {"Authorization" : token} } )
    .then((response) => {
        for(var i=0;i<response.data.length; i++){
            showdownloadDetails(response.data[i]);
        }

    })
    .catch(err => console.log(err));

}

function showdownloadDetails(downloadhistory){
    const row = document.createElement('tr');

    const fileUrlCell = document.createElement('td');
    fileUrlCell.innerHTML = `<a href=${downloadhistory.fileUrl}>myexpense/${downloadhistory.createdAt}</a>`;

    const date = document.createElement('td');
    date.textContent = downloadhistory.createdAt;

    row.appendChild(fileUrlCell);
    row.appendChild(date);

    tableBody.appendChild(row);

}