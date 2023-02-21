const bcrypt = require("bcrypt");
const userDB = {
    users: require("../model/users.json"),
    setUsers: function(users) { this.users = users; }
}

require("dotenv").config();
const jwt = require("jsonwebtoken");
const fsPromises = require("fs").promises;
const path = require("path");

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

        const accessToken = jwt.sign(
            { "username": user.username },
            process.env.ACCESS_TOKEN_SECRET,
            { "expiresIn": "30s" }
        );
        const refreshToken = jwt.sign(
            { "username": user.username },
            process.env.REFRESH_TOKEN_SECRET,
            { "expiresIn": "1d" }
        );

        // save refreshToken
        userDB.setUsers(
            [...userDB.users.filter(person => person.username !== user.username),
            {...user, refreshToken}]
        );
        await fsPromises.writeFile(
            path.join(__dirname, "..", "model", "users.json"),
            JSON.stringify(userDB.users)
        )

        // send access token as json & refresh token as http only cookie
        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        return res.status(200).json({ accessToken });
    } catch (err) {
        return res.status(500).json({ "message": "Server error while logging in!" });
    }
}

module.exports = handleLogin;