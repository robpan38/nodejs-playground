const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");

const userDB = {
    users: require("../model/users.json"),
    setUsers: function (users) { this.users = users; }
}

const handleRegister = async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ "message": "Username and password are both required!" });
    }

    const duplicate = userDB.users.find(user => user.username === username);
    if (duplicate) {
        return res.status(409).json({ "message": "An account already exists with that username!" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = { username: username, password: hashedPassword };
        userDB.setUsers([...userDB.users, user]);
        await fsPromises.writeFile(
            path.join(__dirname, "..", "model", "users.json"),
            JSON.stringify(userDB.users)
        );
    } catch (err) {
        return res.status(500).json({ "message": "Something went wrong when trying to create an account!" });
    }
    
    return res.status(201).json({ "message": `User ${username} was created successfully!` });
};

module.exports = handleRegister;