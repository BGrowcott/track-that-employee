[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# Track That Employee
----

## Description

A command-line application to manage a company's employee database, using Node.js, Inquirer, and MySQL.

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [License](#license)
4. [Contributing](#contributing)
5. [Questions](#questions)

## Installation
----
1. Git clone this repository
2. Navigate to the correct directory in your command line
3. Run command: npm install
4. Run command: node index.js
5. Answer the prompts!
----
## Usage

- Upon Starting the application a user is presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role.
    - Choosing to view all departments displays a formatted table showing department names and department ids.
    - Choosing to view all roles displays a formatted table showing job title, role id, the department that role belongs to, and the salary for that role.
    - Choosing to view all employees displays a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to.

    - Choosing to add a department prompts the user to enter the name of the department and the new department is added to the database.
    - Choosing to add a role prompts the user to enter the name, salary, and department for the role and that role is added to the database.
    - Choosing to add an employee prompts the user to enter the employee’s first name, last name, role, and manager, and that employee is added to the database.

    - Choosing to update an employee role prompts to select an employee to update and their new role and this information is updated in the database.

### Video Demonstration

Please check out this video of the application in action - [Video](https://drive.google.com/file/d/1f02yjxDO34FwWi4Fl7kmYJt80sTEJc6R/view?usp=sharing)

## License

This project is covered under the MIT License.

## Contributing

Ben Growcott - [GitHub](https://github.com/BGrowcott)

## Questions

If you have any questions or suggestions please contact me via my GitHub or Email:

[GitHub](https://github.com/BGrowcott)

[Email](mailto:bg.coding101@gmail.com)

----