const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const fs = require('fs');
require('dotenv').config();
const { createConnection } = require('net');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: process.env.DB_PASSWORD,
        database: 'employees_db'
    }
)

db.connect(function (err) {
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
        .prompt({
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
        .then(function ({ task }) {
            switch (task) {
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
                case 'Add Role':
                    addRole();
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

function viewAllEmployees() {
    let sql = `SELECT * FROM employee`;
    db.query(sql, function (err, res) {
        if (err) throw err;
        console.log('\n');
        console.table(res);
        console.log('\n');
        startingPrompt();
    });
}

// function viewAllRoles(){
//     rolesList();
//     startingPrompt();
// }

function viewAllRoles() {
    let sql = `SELECT * FROM employees_db.role`;
    db.query(sql, function (err, res) {
        if (err) throw err;
        console.log('\n');
        console.table(res);
        console.log('\n');
        startingPrompt();
    });
}

function viewAllDepartments() {
    departmentList();
    startingPrompt();
}

function departmentList() {
    let sql = `SELECT * FROM department`;
    db.query(sql, function (err, res) {
        if (err) throw err;
        console.log('\n');
        console.table(res);
        console.log('\n');
        startingPrompt();
    });
}

//function for adding an employee
function addEmployee() {
    console.log("please follow the prompt to add an employee!");
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'firstName',
                message: "What is the employee's first name?",
            },
            {
                type: 'input',
                name: 'lastName',
                message: "What is the employee's last name?",
            },
        ])
        .then(async function (answer) {
            //saves the answers from previous prompt
            const newEmployee = [answer.firstName, answer.lastName]
            let sql = `SELECT title, id FROM employees_db.role`;
            await db.promise().query(sql)
                .then(([data]) => {
                    //maps the data from the query in the previous .then
                    const roles = data.map(({ id, title }) => ({ name: title, value: id }));
                    inquirer
                        .prompt([
                            {
                                type: 'list',
                                name: 'employeeRole',
                                message: "What is the employee's role?",
                                choices: roles,
                            },
                        ])
                        .then(async function (roleAnswer) {
                            //saves the roles for new employees
                            newEmployee.push(roleAnswer.employeeRole)
                            let sql2 = `SELECT first_name, last_name FROM employee WHERE manager_id IS NOT NULL`;
                            await db.promise().query(sql2)
                                .then(([data]) => {
                                    //maps the data from the query in the previous .then
                                    let managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
                                    // managers = managers.push("Employee Is Manager"); used for if hes a manager
                                    inquirer
                                        .prompt([
                                            {
                                                type: 'list',
                                                name: 'employeeManager',
                                                message: "Who is the employee's Manage?",
                                                choices: managers,
                                            },
                                        ])
                                        .then(function (managerAnswer) {
                                            let manager = managerAnswer.employeeManager;
                                            console.log(manager);
                                            newEmployee.push(manager);
                                            // if (employeeManager = "Employee Is Manager"){  used for if he is manager
                                            //     employeeManager = NULL;
                                            // }
                                            db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)VALUES (?, ?, ?, ?)`, newEmployee, function (err, res) {
                                                if (err) throw err;
                                                viewAllEmployees();
                                            });
                                        })
                                })
                        })
                })
        })
}

async function addRole(){
    inquirer
    .prompt([
        {
            type: 'input',
            name: 'roleName',
            message: 'What is the name of the Role?'
        },
        {
            type: 'input',
            name: 'roleSalary',
            message: 'What is the salary for this Role?'
        },
    ])
    .then(function (answer) {
        db.query("INSERT INTO role (title, salary) VALUE (?, ?)", [answer.roleName, answer.roleSalary], function (err, res) {
            if (err) throw err;
            viewAllRoles();
        })
    })
}

async function updateEmployeeRole() {
    let sql = `SELECT * FROM employee`;
    await db.promise().query(sql)
        .then(async ([data]) => {
            let employee = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'employeeName',
                        message: "Which employee's role do you want to update?",
                        choices: employee,
                    },
                ])
                .then(async (employeeName) => {
                    let updateEmployee = [employeeName];
                    let sql = `SELECT title, id FROM employees_db.role`;
                    await db.promise().query(sql)
                        .then(async ([data]) => {
                            const Roles = data.map(({ id, title }) => ({ name: title, value: id }));
                            inquirer
                                .prompt([
                                    {
                                        type: 'list',
                                        name: 'employeeRole',
                                        message: "Which role do you want to assign the selected Employee?",
                                        choices: Roles,
                                    }
                                ])
                                .then(function (answer) {
                                    updateEmployee.push(answer.Roles);
                                    db.query("UPDATE employee SET role_id=? WHERE first_name=?", [updateEmployee.employee, updateEmployee.Roles]);
                                    viewAllEmployees();
                                })
                        })

                })
        }

        )

}

//addDepartment adds a department to the list of departments
async function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'departmentName',
                message: 'What is the name of the department?'
            },
        ])
        .then(function (answer) {
            db.query("INSERT INTO department (department_name) VALUE (?)", [answer.departmentName], function (err, res) {
                if (err) throw err;
                departmentList();
            })
        })
}