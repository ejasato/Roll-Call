const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const fs = require('fs');
const { createConnection } = require('net');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'employees_db'
    }
)

createConnection.connect(function (err){
    if (err) throw (err);
    console.log(`Connected to the employees_db database.`)
    console.log(`

    ███████╗███╗░░░███╗██████╗░██╗░░░░░░█████╗░██╗░░░██╗███████╗███████╗███╗░░░███╗░█████╗░███╗░░██╗░█████╗░░██████╗░███████╗██████╗░
    ██╔════╝████╗░████║██╔══██╗██║░░░░░██╔══██╗╚██╗░██╔╝██╔════╝██╔════╝████╗░████║██╔══██╗████╗░██║██╔══██╗██╔════╝░██╔════╝██╔══██╗
    █████╗░░██╔████╔██║██████╔╝██║░░░░░██║░░██║░╚████╔╝░█████╗░░█████╗░░██╔████╔██║███████║██╔██╗██║███████║██║░░██╗░█████╗░░██████╔╝
    ██╔══╝░░██║╚██╔╝██║██╔═══╝░██║░░░░░██║░░██║░░╚██╔╝░░██╔══╝░░██╔══╝░░██║╚██╔╝██║██╔══██║██║╚████║██╔══██║██║░░╚██╗██╔══╝░░██╔══██╗
    ███████╗██║░╚═╝░██║██║░░░░░███████╗╚█████╔╝░░░██║░░░███████╗███████╗██║░╚═╝░██║██║░░██║██║░╚███║██║░░██║╚██████╔╝███████╗██║░░██║
    ╚══════╝╚═╝░░░░░╚═╝╚═╝░░░░░╚══════╝░╚════╝░░░░╚═╝░░░╚══════╝╚══════╝╚═╝░░░░░╚═╝╚═╝░░╚═╝╚═╝░░╚══╝╚═╝░░╚═╝░╚═════╝░╚══════╝╚═╝░░╚═╝
    `)
    startingPrompt();
})

//prompt that asks the user what they would like to do
function startingPrompt() {
    inquirer
        .prompt ({
            type: 'list',
            name: 'task',
            message: 'What would you like to do?',
            choices: [
                'View All Employees',
                'Add Employee',
                'Update Employee Role',
                'View All Roles',
                'Add Role',
                'View All Departments',
                'Add Department',
                'Exit'
            ]
        })
        //switch that can go to a specific function depending on the user input
        .then ( function ({task}){
            switch(task) {
                case 'View All Employees':
                    viewAllEmployees();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Update Employee Role':
                    updateEmployeeRole();
                    break;
                case 'View All Roles':
                    viewAllRoles();
                    break;
                case 'View All Departments':
                    viewAllDepartments();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'Exit':
                    db.end();
                    break;
            }
        })
}

function viewAllEmployees(){
    let list = 'SELECT * FROM employee';
    db.query(list, function(err, res) {
        if (err) throw err;
        console.table(res);
        startingPrompt();
    });
}