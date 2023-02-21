const e = require("express");
const express = require("express");
const path = require("path");
const router = express.Router();
const employeeController = require("../../controllers/employee-controller");
const ROLES_LIST = require("../../config/roles-list");
const verifyRoles = require("../../middleware/verifyRoles");

router.route('/')
    .get(employeeController.getEmployees)
    .post(verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin), employeeController.addEmployee)

router.route('/:id')
    .get(employeeController.getEmployee)
    .put(verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin), employeeController.editEmployee)
    .delete(verifyRoles(ROLES_LIST.Admin), employeeController.deleteEmployee)

module.exports = router;