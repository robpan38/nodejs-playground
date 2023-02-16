const e = require("express");
const express = require("express");
const path = require("path");
const router = express.Router();

const data = {};
data.employees = require("../../data/data.json");

const createNewEmployee = (body) => {
    const maxId = Math.max(...data.employees.map(employee => employee.id));
    let newEmployee = {
        id: maxId != -Infinity ? maxId + 1 : 1, 
        ...body
    };

    return newEmployee;
}

const findEmployeeById = (id) => {
    id = parseInt(id);
    const employee = data.employees.find(employee => employee.id === id);

    return employee;
}

router.route('/')
    .get((req, res) => {
        res.json(data.employees);
    })
    .post((req, res) => {
        const newEmployee = createNewEmployee(req.body);

        data.employees = [...data.employees, newEmployee];
        res.send(newEmployee);
    })

router.route('/:id')
    .get((req, res) => {
        const employee = findEmployeeById(req.params.id);

        if (employee) {
            res.send(employee);
        } else {
            res.send({
                "Error": "No employee found with that id!"
            })
        }
    })
    .put((req, res) => {
        const employee = findEmployeeById(req.params.id);

        if (!employee) {
            const newEmployee = createNewEmployee(req.body);

            data.employees = [...data.employees, newEmployee];
            res.send(newEmployee);
        } else {
            let updatedEmployee = { id: parseInt(req.params.id), ...req.body };
            data.employees = data.employees.map(employee => {
                if (employee.id === parseInt(req.params.id)) {
                    return updatedEmployee;
                } else {
                    return employee;
                }
            })

            res.send(updatedEmployee);
        }
    })
    .delete((req, res) => {
        let deletedEmployee = null;
        data.employees = data.employees.filter(employee => {
            let parsedId = parseInt(req.params.id);
            if (employee.id === parsedId) {
                deletedEmployee = {...employee};
            }
            return employee.id !== parsedId;
        })

        if (deletedEmployee) {
            res.send(deletedEmployee);
        } else {
            res.send({
                "Error": "No employee found with that id!"
            });
        }
    })

module.exports = router;