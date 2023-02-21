const fsPromises = require("fs").promises;
const path = require("path");
const userDB = {
    users: require("../model/users.json"),
    setUsers: function (users) { this.users = users; }
}

const handleLogout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.status(204).json({ "message": "refreshToken successfully deleted!" });
    }
    const refreshToken = cookies.jwt;

    const user = userDB.users.find(user => user.refreshToken && user.refreshToken === refreshToken);
    if (!user) {
        res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        return res.status(204).json({ "message": "refreshToken successfully deleted!" });
    }

    userDB.setUsers([...userDB.users, {...user, refreshToken: ''}]);
    await fsPromises.writeFile(
        path.join(__dirname, "..", "model", "users.json"),
        JSON.stringify(userDB.users)
    )
    res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    return res.status(204).json({ "message": "refreshToken successfully deleted!" });
};

module.exports = handleLogout;