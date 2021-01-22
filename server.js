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
        choices: ["View All Employees", "View All Employees By Department", "View All Employees by Manager", "Add Employee", "Remove Employee", "Update Employee", "Update Manager"],
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
            return connection.promise().query("SELECT * FROM role;")
        })
        .then(([rows]) => {
            roleArray = rows.map(role => {
                let obj = {name: role.title, value: role.id} 
                return obj
            })
            return inquirer.prompt([
                {
                    name: "role_id", type: "list", message: "Choose role", choices: roleArray
                }
            ])
        }) 
        .then(answers => {
            return connection.promise().query("INSERT INTO employee SET ?", answers)
        })
        .then(() => {
            console.log("employee added") 
            init()
        })
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
