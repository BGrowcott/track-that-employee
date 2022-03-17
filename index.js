const inquirer = require("inquirer");
const mysql = require("mysql2");
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const cTable = require("console.table");
const { resolve } = require("path");

// connecting to the database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "password",
    database: "employees_db",
  },
  console.log(`Connected to the employees_db database.`)
);

// Prompts
const openingQuestion = () => {
  return inquirer.prompt([
    {
      type: "list",
      name: "mainOptions",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
      ],
      message: "What do you want to do?",
    },
  ]);
};

// add a department prompt
function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "addDepartment",
        message: "Enter new department name:",
      },
    ])
    .then(updateDepartmentTable);
}

// add a role prompt
function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "roleName",
        message: "Enter the name of the new role:",
      },
      {
        type: "input",
        name: "salary",
        message: "Enter a salary for the new role:",
      },
      {
        type: "list",
        name: "department",
        choices: makeDepArray(),
        message: "Which department does the role belong to?",
      },
    ])
    .then(updateRoleTable);
}

function processRequest(answers) {
  const answer = answers.mainOptions;
  if (answer === "View all departments") {
    showTable("department");
  } else if (answer === "View all roles") {
    showTable("job_role");
  } else if (answer === "View all employees") {
    showTable("employee");
  } else if (answer === "Add a department") {
    addDepartment();
  } else if (answer === "Add a role") {
    addRole();
  }
}

const startPrompts = () => {
  openingQuestion()
    .then(processRequest)
    .catch((err) => console.error(err));
};

startPrompts();

// Database queries
function showTable(table) {
  db.query(`SELECT * FROM ${table}`, function (err, results) {
    console.table(`\n${table.toUpperCase()} Table:`, results);
    startPrompts();
  });
}

function updateDepartmentTable(answer) {
  const newDepartment = answer.addDepartment;
  db.query(
    `INSERT INTO department (department_name)
    VALUES ("${newDepartment}")`,
    function (err, results) {
      console.log(newDepartment + " added!");
      startPrompts();
    }
  );
}

function updateRoleTable(answer) {
  const { roleName, salary, department } = answer;
  db.query(
    `INSERT INTO job_role (title, salary, department_id)
    VALUES ("${roleName}", "${salary}", "${idFromDepName(department)}")`,
    function (err, results) {
      console.log(roleName + " added!");
      startPrompts();
    }
  );
}

// make a array out of the department names in the database
function makeDepArray() {
  const departmentArray = [];
  db.query(`SELECT department_name FROM department`, function (err, results) {
    results.forEach((department) =>
      departmentArray.push(department.department_name)
    );
  });
  return departmentArray;
}

// PROMISE PROBLEMS!!!

async function test() {
  try {
  const id = await idFromDepName();
  console.log(id)
  return id
  }
  catch(error){console.log(error)}
}

async function idFromDepName() {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT id FROM department WHERE department_name = "Sales"`,
      function (err, results) {
        if (err) return reject(err)
        return resolve(results[0].id);
      }
    );
  });
}

console.log(idFromDepName().then((id)=>{return id}))


// function idFromDepName(department) {
//   let depId;
//   db.query(
//     `SELECT id FROM department WHERE department_name = "${department}"`,
//     function (err, results) {
//       depId = results[0].id;
//       console.log(depId);
//     }
//   );
//   return depId
// }

// // let depId;
// async function idFromDepName(department) {
//   return new Promise((resolve) => {
//       db.promise().query(`SELECT id FROM department WHERE department_name = "${department}"`, (err, results)=>{
//       resolve(results[0])
//     });
//   });
// }

// console.log(idFromDepName("Sales"));
// // db.promise()
// //   .query("SELECT id FROM department WHERE department_name = 'Sales'")
// //   .then(([rows]) => {
// //     console.log(rows[0].id);
// //   });

