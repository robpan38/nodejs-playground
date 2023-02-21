const jwt = require("jsonwebtoken");
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    const header = req.headers['authorization'];
    if (!header) {
        return res.status(401).json({ "message": "auth token not present!" });
    }

    const token = header.split(" ")[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).json({ "message": "auth token is invalid!" });

            req.user = decoded.username;
            req.roles = decoded.roles;
            next();
        }
    )
};

module.exports = verifyJWT;