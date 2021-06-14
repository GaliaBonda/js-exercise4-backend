'use strict';

function DataTable(config, data) {
    let table = createTable(config);
    if ('apiUrl' in config) {
        let url = config.apiUrl;
        let arrayData = [];
        sendRequest(url)
            .then(data => {
                for (let key in data.data) {
                    arrayData.push(data.data[key]);
                }
                createTableHead(config, table, arrayData);
                createTableBody(config, table, data, arrayData);
            })
            .catch(err => console.log(err));
    } else {
        createTableHead(config, table);
        createTableBody(config, table, data);
    }


}

async function sendRequest(url) {
    let response = await fetch(url);
    if (response.ok) {
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
    let counterthText = document.createTextNode('№');
    counterTh.appendChild(counterthText);
    headTr.appendChild(counterTh);
    headTr.classList.add('table-head');
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

    }
}

const config1 = {
    parent: '#usersTable',
    columns: [
        { title: 'Имя', value: 'name' },
        { title: 'Фамилия', value: 'surname' },
        { title: 'Возраст', value: 'age' },
    ],
    apiUrl: "http://mock-api.shpp.me/hbondar/users"
};

const users = [
    { id: 30050, name: 'Вася', surname: 'Петров', age: 12 },
    { id: 30051, name: 'Вася', surname: 'Васечкин', age: 15 },
];

DataTable(config1, users);