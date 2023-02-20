const bcrypt = require("bcrypt");
const userDB = {
    users: require("../model/users.json"),
    setUsers: function(users) { this.users = users; }
}

const handleLogin = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ "message": "Both username and password are needed for logging in!" });
    }

    try {
        const user = userDB.users.find(user => user.username === username);
        if (!user) {
            return res.status(401).json({ "message": "User does not exist!" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ "message": "Incorrect password!" });
        }

        // create JWT tokens
        return res.status(200).json({ "message": "Successfully logged in!" });
    } catch (err) {
        return res.status(500).json({ "message": "Server error while logging in!" });
    }
}

module.exports = handleLogin;