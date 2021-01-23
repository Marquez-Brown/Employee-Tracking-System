var mysql = require("mysql2");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "098123",
    database: "ets_DB"
});

// connect to the mysql server and sql database
connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id: ${connection.threadId}`);
    init();
});
function init() {
    inquirer
        .prompt({
            type: "list",
            message: "What would you like to do?",
            name: "action",
            choices: ["View All Employees", "View All Departments", "View All Roles", "Add Employee", "Add Role", "Add Department", "Remove Employee", "Update Employee Role", "exit"]
        })
        .then(({ action }) => {
            //example of how this works
            //   const answers = {action: "view", type: "all"}
            // const action = answers.action
            // const type = answers.type
            // const {action, type} = answers
            if (action === "View All Employees") {
                viewAllEmployees()
            } else if (action === "View all Departments") {
                viewAllDepartments()
            } else if (action === "View All Roles") {
                viewAllRoles()
            }
            else if (action === "Add Employee") {
                addEmployees()
            }
            else if (action === "Add Role") {
                addRole()
            }
            else if (action === "Add Department") {
                addDepartment()
            }
            else if (action === "Remove Employee") {
                viewAllEmployees()
            }
            else if (action === "Update Employee Role") {
                viewAllEmployees()
            }
            else {
                exit();
            }
        });


    function exit() {
        connection.end();
    }

    function viewAllEmployees() {
        connection.promise().query("SELECT * FROM employee;")
            .then(([rows]) => {
                console.table(rows);
                init();
            })
    }

    function viewAllRoles() {
        connection.query("SELECT title, salary, department_id FROM role",
            function (err, rows) {
                if (err) throw err;
                console.table(rows);
                init();
            });
    }

   //shows department table
    function viewAllDepartments() {

        connection.query("SELECT name FROM department",
            function (err, rows) {
                if (err) throw err;
                console.log(rows);
                init();
            });
    }
    //adds employees
    function addEmployees() {
        let employeeArray;
        let roleArray;
        connection.promise().query("SELECT * FROM employee;")
            .then(([rows]) => {
                employeeArray = rows.map(emp => {
                    let obj = { name: `${emp.first_name} ${emp.last_name}`, value: emp.id }
                    return obj
                })
                employeeArray.push({ name: "None", value: null })
                return connection.promise().query("SELECT * FROM role;")
            })
            .then(([rows]) => {
                roleArray = rows.map(role => ({ name: role.title, value: role.id }))
                return inquirer.prompt([
                    { name: "first_name", type: "input", message: "what is the first name" },
                    { name: "last_name", type: "input", message: "what is the last name" },
                    { name: "role_id", type: "list", message: "Choose role", choices: roleArray },
                    { name: "manager_id", type: "list", message: "Choose Manager", choices: employeeArray }

                ])
            })
            .then(answers => {
                return connection.promise().query("INSERT INTO employee SET ?", answers)
            })
            .then(() => {
                console.log("employee added")
                init()
            })
            .catch(err => console.log(err))
    }
    // adds role
    function addRole() {
        let departmentArray;
        connection.promise().query("SELECT * FROM department")
            .then(([rows]) => {
                departmentArray = rows.map(dep => ({ name: dep.name, value: dep.id }))
                return inquirer.prompt([
                    { name: "title", type: "input", message: "what is the title?" },
                    { name: "salary", type: "input", message: "what is the roles salary?" },
                    { name: "department_id", type: "list", message: "Choose department", choices: departmentArray }
                ])
            })
            .then(answers => {
                return connection.promise().query("INSERT INTO role SET ?", answers)
            })
            .then(() => {
                console.log("role added")
                init()
            })
            .catch(err => console.log(err))
    }
    //gotta figure out how o get this working
    function addDepartment() {
        inquirer.prompt([
            { name: "department", type: "input", message: "what department are you adding?" }
        ])
            .then((answers) => {
                connection.promise().query("INSERT INTO department ?", answers)
                    .then(() => {
                        console.log("department added")
                        init()
                    })
                    .catch(err => console.log(err))
            })}
        }
