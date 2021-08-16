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
                    data.data[key]['datakey'] = key;

                }
                console.log(arrayData);
                createTableHead(config, table, arrayData);
                createTableBody(config, table, data, arrayData);
                let menu = document.createElement('div');
                document.getElementById('usersTable').insertBefore(menu, table);
                menu.classList.add('table-menu');

                createAddButton(table, menu);
                createSearchField(table, menu);
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
    console.log('Something went wrong');
}

async function deleteData(url) {
    let response = await fetch(url, { method: "DELETE" });
    if (response.ok) {
        window.location.reload();
        return await response.json();
    }
    console.log('Something went wrong');
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
    let counterTh = createCell('th', '№', headTr);
    counterTh.classList.add('table-head');
    if (apiData) {
        for (let key in apiData[0]) {
            if (key !== 'datakey') {
                let th = createCell('th', key, headTr);
                th.classList.add('table-head');
            }
        }

    } else {
        for (let i = 0; i < config.columns.length; i++) {
            let th = createCell('th', config.columns[i].title, headTr);
            th.classList.add('table-head');
        }
    }
    let buttonTh = document.createElement('th');
    let buttonThText = document.createTextNode('Действия');
    buttonTh.appendChild(buttonThText);
    headTr.appendChild(buttonTh);
    buttonTh.classList.add('table-head');

}

function createCell(cellType, text, parent) {
    let cell = document.createElement(cellType);
    let innerText = document.createTextNode(text);
    cell.appendChild(innerText);
    parent.appendChild(cell);
    return cell;
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
        let counterTd = createCell('td', ++counter, tr);
        counterTd.classList.add('table-data');
        counterTd.style.textAlign = "center";
        if (apiData) {
            for (let key in apiData[i]) {
                if (key !== 'id') {
                    let td = createCell('td', apiData[i][key], tr);
                    td.classList.add('table-data');
                    if (key === 'birthday') {
                        const birthDate = new Date(td.innerHTML);
                        td.innerHTML = `${birthDate.getDate()}/${birthDate.getMonth() + 1}/${birthDate.getFullYear()}`;
                    }
                }
            }
        } else {
            for (let j = 0; j < config.columns.length; j++) {
                let td = createCell('td', users[i][config.columns[j].value], tr)
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
            button.setAttribute('data-id', apiData[i]['datakey']);
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
        if (confirm("Удалить запись?")) {
            deleteData(`https://mock-api.shpp.me/hbondar/users/${e.target.getAttribute('data-id')}`);
        }

    }
});


function createAddButton(table, block) {
    let addBtn = document.createElement('button');
    addBtn.appendChild(document.createTextNode('Добавить новую запись'));
    block.appendChild(addBtn);
    addBtn.classList.add('add-btn');
    addBtn.onclick = () => {
        if (table.rows[1].cells[0].innerHTML) {
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
                    if (cellInput.getAttribute('id') === 'birthday') {
                        cellInput.setAttribute('type', 'date');
                    }
                }
            }
        } else {
            alert('Please, fill the data');
        }

    }
}

function createSearchField(table, block) {
    let searchField = document.createElement("input");
    searchField.setAttribute("type", "text");
    searchField.setAttribute("placeholder", "Поиск");
    block.appendChild(searchField);
    searchField.classList.add('search');
    let rows = [];
    let cellString = '';
    for (let i = 0; i < table.rows.length; i++) {
        let cells = table.rows[i].cells;

        for (let j = 0; j < cells.length - 1; j++) {
            cellString = cellString + ' ' + cells[j].innerHTML;

        }
        rows.push(cellString.toLowerCase());
        cellString = '';
    }
    searchField.oninput = () => {
        for (let i = 0; i < rows.length; i++) {
            if (!rows[i].includes(searchField.value)) {
                table.rows[i].classList.add('row-hide');
            } else {
                table.rows[i].classList.remove('row-hide');
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
    console.log('Something went wrong');
}

function getUserInfo() {
    let table = document.querySelector('.table');
    let userInfo = {};
    for (let i = 1; i < table.tHead.rows[0].cells.length - 2; i++) {
        let input = document.getElementById(table.tHead.rows[0].cells[i].innerHTML);
        userInfo[table.tHead.rows[0].cells[i].innerHTML] = input.value;
    }
    userInfo.id = +table.rows[table.rows.length - 1].cells[table.rows[0].cells.length - 1].firstChild.getAttribute('data-id') + 1;//here
    return userInfo;
}


function checkInputFilling() {
    let allInputs = document.querySelectorAll('input');
    let inputesAreFilled = true;
    allInputs.forEach(function (input) {
        if (input.value === '' && !input.classList.contains('search')) {
            input.classList.add('empty-input');
            inputesAreFilled = false;
        } else {
            input.classList.remove('empty-input');
        }
    });
    return inputesAreFilled;
}