INSERT INTO department (department_name)
VALUES ('Engineering'),
       ('Finance'),
       ('Legal'),
       ('Sales'); 

INSERT INTO role (title, salary, department_id)
VALUES ('Lead Engineer', 150000, 1),
       ('Software Engineer', 120000, 1),
       ('Legal Team Lead', 250000, 3),
       ('Lawyer', 190000, 3),
       ('Account Manager', 160000, 2), 
       ('Accountant', 125000, 2),
       ('Head of Sales', 100000, 4),
       ('Salesperson', 80000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Bunsen', 'Burner', 1, null),
       ('The', 'Master', 2, 1),
       ('Role', 'Model', 3, null),
       ('Paper', 'Airplane', 4, 3),
       ('Animal', 'House', 4, 3),
       ('Kirk', 'Bond', 5, null),
       ('Manual', 'Automatic', 6, 5),
       ('Camilla', 'Smith', 6, 5),
       ('Daft', 'Punk', 7, null),
       ('Caterpillar', 'Machine', 8, 9),
       ('Nathan', 'Ross', 8, 9); 