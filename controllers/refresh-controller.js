const jwt = require("jsonwebtoken");
require("dotenv").config();
const userDB = {
    users: require("../model/users.json"),
    setUsers: function (users) { this.users = users; }
}

const handleRefreshToken = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.status(401).json({ "message": "no refresh token attached!" });
    }
    const refreshToken = cookies.jwt;

    const user = userDB.users.find(user => user.refreshToken && user.refreshToken === refreshToken);
    if (!user) {
        return res.status(403).json({ "message": "refresh token is not associated with an account!" });
    }

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || decoded.username !== user.username) {
                return res.status(403).json({ "message": "refresh token is not associated with this account!" });
            }

            const accessToken = jwt.sign(
                { "username": user.username },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "30s" }
            );
            res.status(200).json({ accessToken });
        }
    )
}

module.exports = handleRefreshToken;