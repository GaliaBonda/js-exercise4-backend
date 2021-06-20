'use strict';

function DataTable(config, data) {
    let table = createTable(config);
    if ('apiUrl' in config) {
        let url = config.apiUrl;
        let arrayData = [];
        getData(url)
            .then(data => {
                for (let key in data.data) {
                    arrayData.push(data.data[key]);
                }
                createTableHead(config, table, arrayData);
                createTableBody(config, table, data, arrayData);
                createAddButton(table);
            })
            .catch(err => console.log(err));

    } else {
        createTableHead(config, table);
        createTableBody(config, table, data);
    }


}

async function getData(url) {
    let response = await fetch(url);
    if (response.ok) {
        return await response.json();
    }
    const error = await response.json();
    const e = new Error('Something went wrong');
    e.data = error;
    throw e;
}

async function deleteData(url) {
    let response = await fetch(url, { method: "DELETE" });
    if (response.ok) {
        window.location.reload();
        return await response.json();
    }
    const error = await response.json();
    const e = new Error('Something went wrong');
    e.data = error;
    throw e;
}



function createTable(config) {
    let usersTable = document.querySelector(config.parent);
    let table = document.createElement('table');
    usersTable.appendChild(table);
    table.classList.add('table');
    return table;
}

function createTableHead(config, table, apiData) {
    let tHead = document.createElement('thead');
    table.appendChild(tHead);
    let headTr = document.createElement('tr');
    tHead.appendChild(headTr);
    let counterTh = document.createElement('th');
    let counterThText = document.createTextNode('№');
    counterTh.appendChild(counterThText);
    headTr.appendChild(counterTh);
    counterTh.classList.add('table-head');
    if (apiData) {
        for (let key in apiData[0]) {
            let th = document.createElement('th');
            let thText = document.createTextNode(key);
            th.appendChild(thText);
            headTr.appendChild(th);
            th.classList.add('table-head');
        }
    } else {
        for (let i = 0; i < config.columns.length; i++) {
            let th = document.createElement('th');
            let thText = document.createTextNode(config.columns[i].title);
            th.appendChild(thText);
            headTr.appendChild(th);
            th.classList.add('table-head');
        }
    }
    let buttonTh = document.createElement('th');
    let buttonThText = document.createTextNode('Действия');
    buttonTh.appendChild(buttonThText);
    headTr.appendChild(buttonTh);
    buttonTh.classList.add('table-head');

}

function createTableBody(config, table, data, apiData) {
    let tBody = document.createElement('tbody');
    table.appendChild(tBody);
    let counter = 0;
    let tableLength = apiData ? apiData.length : data.length;
    for (let i = 0; i < tableLength; i++) {
        let tr = document.createElement('tr');
        tBody.appendChild(tr);
        tr.classList.add('table-row');
        let counterTd = document.createElement('td');
        tr.appendChild(counterTd);
        let counterTdText = document.createTextNode(++counter);
        counterTd.appendChild(counterTdText);
        counterTd.classList.add('table-data');
        counterTd.style.textAlign = "center";

        if (apiData) {
            for (let key in apiData[i]) {
                let td = document.createElement('td');
                let tdText = document.createTextNode(apiData[i][key]);
                td.appendChild(tdText)
                tr.appendChild(td);
                td.classList.add('table-data');
            }
        } else {
            for (let j = 0; j < config.columns.length; j++) {
                let td = document.createElement('td');
                let tdText = document.createTextNode(users[i][config.columns[j].value]);
                td.appendChild(tdText)
                tr.appendChild(td);
                td.classList.add('table-data');
            }
        }
        let buttonTd = document.createElement('td');
        tr.appendChild(buttonTd);
        let button = document.createElement('button');
        button.classList.add('delete-btn');
        let buttonText = document.createTextNode('Удалить');
        button.appendChild(buttonText);
        if (apiData) {
            button.setAttribute('id', apiData[i]['id']);
        } else {
            button.setAttribute('id', users[i]['id']);
        }
        buttonTd.appendChild(button);
        buttonTd.classList.add('table-data');
        buttonTd.style.textAlign = "center";
    }
}

const config1 = {
    parent: '#usersTable',
    columns: [
        { title: 'Имя', value: 'name' },
        { title: 'Фамилия', value: 'surname' },
        { title: 'Возраст', value: 'age' },
    ],
    apiUrl: "https://mock-api.shpp.me/hbondar/users"
};

const users = [
    { id: 30050, name: 'Вася', surname: 'Петров', age: 12 },
    { id: 30051, name: 'Вася', surname: 'Васечкин', age: 15 },
];

DataTable(config1, users);

document.addEventListener('click', e => {
    if (e.target.className == 'delete-btn') {
        deleteData(`https://mock-api.shpp.me/hbondar/users/${e.target.id}`);
    }
});

// let addBtn = document.createElement('button');
// let addBtnText = document.createTextNode('Добавить');
// addBtn.appendChild(addBtnText);
// let usersTable = document.querySelector(config1.parent);
// document.querySelector('.container').insertBefore(addBtn, usersTable);

function createAddButton(table) {
    let addBtn = document.getElementById('addBtn');
    addBtn.onclick = () => {
        let row = table.insertRow(1);
        row.classList.add('table-row');
        for (let i = 0; i < table.rows[0].cells.length; i++) {
            let cell = row.insertCell();
            cell.classList.add('table-data');
            if (i != 0 && i != table.rows[0].cells.length - 1 && i != table.rows[0].cells.length - 2) {
                let cellInput = document.createElement('input');
                cell.appendChild(cellInput);
                cellInput.classList.add('input');
                cellInput.setAttribute('id', table.tHead.rows[0].cells[i].innerHTML);
            }
        }
    }
}


document.addEventListener('keyup', e => {
    if (e.target.tagName === 'INPUT' && e.keyCode === 13 && checkInputFilling()) {
        let data = getUserInfo();
        postData(config1.apiUrl, data);
    }
});

async function postData(url, data) {
    let response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    console.log(response.ok);
    if (response.ok) {
        window.location.reload();
        return await response.json();
    }
    const error = await response.json();
    const e = new Error('Something went wrong');
    e.data = error;
    throw e;
}




function getUserInfo() {
    let table = document.querySelector('.table');
    let userInfo = {};
    for (let i = 1; i < table.tHead.rows[0].cells.length - 2; i++) {
        //console.log(table.tHead.rows[0].cells[i].innerHTML);
        let input = document.getElementById(table.tHead.rows[0].cells[i].innerHTML);
        //console.log(input.value);
        userInfo[table.tHead.rows[0].cells[i].innerHTML] = input.value;
    }
    //console.log(table.rows[0].cells.length);
    userInfo.id = +table.rows[table.rows.length - 1].cells[table.rows[0].cells.length - 2].innerHTML + 1;
    //console.log(+table.rows[table.rows.length - 1].cells[table.rows[0].cells.length - 2].innerHTML + 1);
    //console.length(table.rows[table.rows.length - 1].cells[table.rows[0].cells.length - 2]);
    return userInfo;

    //console.log(table.tHead.rows[0].cells[0].innerHTML);
}


function checkInputFilling() {
    let allInputs = document.querySelectorAll('input');
    //console.log(allInputs);
    let inputesAreFilled = true;
    allInputs.forEach(function (input) {
        //console.log("Input filling: " + input.value);
        if (input.value === '') {
            //console.log('empty input');
            input.classList.add('empty-input');
            inputesAreFilled = false;
            //addUser
        } else {
            input.classList.remove('empty-input');
        }
    });
    //console.log(inputesAreFilled);
    return inputesAreFilled;
}

//deleteData(`https://mock-api.shpp.me/hbondar/users/44`);
// deleteData(`https://mock-api.shpp.me/hbondar/users/45`);