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
        choices: ["View All Employees", "View All Employees By Department", "View All Employees by Manager", "Add Employee", "Add Role", "Remove Employee", "Update Employee", "Update Manager"],
      })
      .then(({ action }) => {
          //example of how this works
        //   const answers = {action: "view", type: "all"}
        // const action = answers.action
        // const type = answers.type
        // const {action, type} = answers
        if (action === "View All Employees") {
          viewAllEmployees()                                    
        } else if (action === "View all Employees By Deparment") {
          bidItem();
        } else if (action === "View All Employees by Manager") {
          viewAllEmployees()
        }
          else if (action === "View All Employees By Manager") {
            viewAllEmployees()
          }
          else if (action === "Add Employee") {
          addEmployees()
          }
          else if (action === "Add Role") {
            addRole()
            }
          else if (action === "Remove Employee") {
            viewAllEmployees()
          }
          else if (action === "Update Employee") {
              viewAllEmployees()
          }
          else if (action === "Update Manager") {
              viewAllEmployees()
          }
        else {
          exit();
        }
      });
    

  function exit(){
    connection.end();
  }

  function viewAllEmployees() {
    connection.promise().query("SELECT * FROM employee;")
        .then(([rows]) => {
            console.table(rows);
            init();
        })
  }

  function addEmployees() {
      let employeeArray;  
      let roleArray;
    connection.promise().query("SELECT * FROM employee;")
        .then(([rows]) => {
            employeeArray = rows.map(emp => {
                let obj = {name: `${emp.first_name} ${emp.last_name}`, value: emp.id} 
                return obj
            })
            employeeArray.push({name: "None", value: null})
            return connection.promise().query("SELECT * FROM role;")
        })
        .then(([rows]) => {
            roleArray = rows.map(role => ({name: role.title, value: role.id}))
            return inquirer.prompt([
                {name: "first_name", type: "input", message: "what is the first name"},
                {name: "last_name", type: "input", message: "what is the last name"},
                {name: "role_id", type: "list", message: "Choose role", choices: roleArray},
                {name: "manager_id", type: "list", message: "Choose Manager", choices: employeeArray}
                
            ])
        }) 
        .then(answers => {
            return connection.promise().query("INSERT INTO employee SET ?", answers)
        })
        .then(() => {
            console.log("employee added") 
            init()
        })
        .catch (err => console.log(err))
  }

  function addRole() {  
    let departmentArray;
  connection.promise().query("SELECT * FROM department")
      .then(([rows]) => {
          departmentArray = rows.map(dep => ({name: dep.name, value: dep.id}))
          return inquirer.prompt([
              {name: "title", type: "input", message: "what is the title?"},
              {name: "salary", type: "input", message: "what is the roles salary?"},
              {name: "department_id", type: "list", message: "Choose department", choices: departmentArray}
          ])
      }) 
      .then(answers => {
          return connection.promise().query("INSERT INTO role SET ?", answers)
      })
      .then(() => {
          console.log("role added") 
          init()
      })
      .catch (err => console.log(err))
}
async function addRole2() {  
    try {
        const [rows] = await connection.promise().query("SELECT * FROM department")
        const departmentArray = rows.map(dep => ({name: dep.name, value: dep.id}))
        const answers = await inquirer.prompt([
            {name: "title", type: "input", message: "what is the title?"},
            {name: "salary", type: "input", message: "what is the roles salary?"},
            {name: "department_id", type: "list", message: "Choose department", choices: departmentArray}
        ])
        await connection.promise().query("INSERT INTO role SET ?", answers)
        console.log("role added") 
        init()
    } catch (err){
        console.log(err)
    }
}
  function bidItem() {
    inquirer.prompt([
      {
        type: "input",
        message: "What are you bidding on?",
        name: "item"
      },
      {
        type: "input",
        message: "How much is the starting bidding price?",
        name: "bid"
      },
      {
        type: "input",
        message: "what category is this item in",
        name: "category"
      }
    ]).then(response => {
      connection.query("INSERT INTO auction SET ?", response, (err, data) => {
        if(err) throw err;
        if(data.affectedRows > 0){
          console.log("Bid inserted successfully!");
        }
        init();
      })
    })
    function postItem() {
      inquirer.prompt([
        {
          type: "input",
          message: "What are you posting?",
          name: "item"
        },
        {
          type: "input",
          message: "How much is the starting price?",
          name: "bid"
        },
        {
          type: "input",
          message: "what category is this item in",
          name: "category"
        }
      ]).then(response => {
        connection.query("INSERT INTO auction SET ?", response, (err, data) => {
          if(err) throw err;
          if(data.affectedRows > 0){
            console.log("Post inserted successfully!");
          }
          init();
        })
      })
    // connection.query(
    //   `INSERT INTO songs(title, artist, genre) VALUES ("Achy, Breaky, Heart", "Billy Ray Cyrus", "Country");`,
    //   (err, data) => {
    //     if (err) throw err;
    //     console.log(data);
    //     if (data.affectedRows > 0) {
    //       console.log("Song inserted successfully.");
    //     }
    //     init();
    //   }
    // );
  }

  function readGenre(genreToSearch) {
    connection.query(
      `SELECT * FROM auction WHERE category = ?;`,
      [genreToSearch],
      (err, data) => {
        if (err) throw err;
        console.table(data);
        connection.end();
      }
    );
  }
  
  function readArtist(artistToSearch) {
    connection.query(
      `SELECT * FROM songs WHERE artist = ?;`,
      [artistToSearch],
      (err, data) => {
        if (err) throw err;
        console.table(data);
        connection.end();
      }
    );
  }}};
