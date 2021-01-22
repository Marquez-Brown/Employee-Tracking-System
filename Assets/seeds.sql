USE ets_DB;

INSERT INTO department (name)
VALUES ("it");

INSERT INTO role (title, salary, department_id)
VALUES ("programmer", 120000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Snow", 1, null);
