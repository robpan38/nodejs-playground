const e = require("express");
const express = require("express");
const path = require("path");
const router = express.Router();
const employeeController = require("../../controllers/employee-controller");

router.route('/')
    .get(employeeController.getEmployees)
    .post(employeeController.addEmployee)

router.route('/:id')
    .get(employeeController.getEmployee)
    .put(employeeController.editEmployee)
    .delete(employeeController.deleteEmployee)

module.exports = router;