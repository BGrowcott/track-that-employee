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
        "Exit"
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

// add an employee

function addEmployee() {
  inquirer.prompt([
    {
      type: "input",
      name: "firstName",
      message: "Enter the employee's first name:",
    },
    {
      type: "input",
      name: "lastName",
      message: "Enter the employee's last name:",
    },
    {
      type: "list",
      name: "role",
      message: "What is the employee's role:",
      choices: makeRoleArray(),
    },
    {
      type: "list",
      name: "manager",
      message: "Who is the employee's manager:",
      choices: makeManagerArray(),
    },
  ])
  .then(updateEmployeeTable)
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
  } else if (answer === "Add an employee") {
    addEmployee();
  } else process.exit()
}

const startPrompts = () => {
  openingQuestion()
    .then(processRequest)
    .catch((err) => console.error(err));
};

startPrompts();

// DATABASE QUERIES
function showTable(table) {
  db.query(`SELECT * FROM ${table}`, function (err, results) {
    console.table(`\n${table.toUpperCase()} Table:`, results);
    startPrompts();
  });
}

// adds a new department
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

// add a new role
async function updateRoleTable(answer) {
  const { roleName, salary, department } = answer;
  idFromDepName(department).then((id) => {
    db.query(
      `INSERT INTO job_role (title, salary, department_id)
    VALUES ("${roleName}", "${salary}", "${id}")`,
      function (err, results) {
        console.log(roleName + " added!");
        startPrompts();
      }
    );
  });
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

// gives back an id based on the department name

function idFromDepName(department) {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT id FROM department WHERE department_name = "${department}"`,
      function (err, results) {
        if (err) return reject(err);
        return resolve(results[0].id);
      }
    );
  });
}

// make an array of roles

function makeRoleArray() {
  const roleArray = [];
  db.query(`SELECT id, title FROM job_role`, function (err, results) {
    results.forEach((job_role) => roleArray.push(`${job_role.title} - ID:${job_role.id}`));
  });
  return roleArray;
}

// make array of managers

function makeManagerArray() {
  const managerArray = [];
  db.query(
    `SELECT id, first_name, last_name FROM employee WHERE manager_id IS NULL`,
    function (err, results) {
      results.forEach((manager) =>
        managerArray.push(
          `${manager.first_name} ${manager.last_name} - ID:${manager.id}`
        )
      );
    }
  );
  return managerArray;
}

// adds the new employee to the table

async function updateEmployeeTable(answer) {
  const { firstName, lastName, role, manager } = answer;
  db.query(
    `INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES ("${firstName}", "${lastName}", "${role.split(':')[1]}", "${manager.split(":")[1]}")`,
    function (err, results) {
      console.log(`${firstName} ${lastName} added!`);
      startPrompts();
    }
  );
}

