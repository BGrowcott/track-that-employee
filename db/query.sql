SELECT e1.id, 
       e1.first_name, 
       e1.last_name, 
       job_role.title, 
       job_role.salary, 
       department.department_name,
       CONCAT(e2.first_name, ' ', e2.last_name) AS manager
FROM employee e1
LEFT JOIN job_role ON e1.role_id = job_role.id
LEFT JOIN department ON job_role.department_id = department.id
LEFT JOIN employee e2 ON e1.manager_id = e2.id;