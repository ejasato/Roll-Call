DROP DATABASE IF EXISTS employees_db;

CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE department (
    id INT PRIMARY KEY,
    department_name VARCHAR(30),
    PRIMARY KEY (id)
)

CREATE TABLE roles (
    id INT PRIMARY KEY,
    roles_title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    PRIMARY KEY(id)
    FOREIGN KEY (department_id)
    REFERENCES department(id)
)

CREATE TABLE employee (
    id INT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    PRIMARY KEY (id)
    FOREIGN KEY (roles_id)
    REFERENCES roles(id)
    FOREIGN KEY (employee_id)
    REFERENCES employee(id)
)