const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.roles) return res.status(401).json({ "message": "no roles available" });
        
        const validRoles = [...allowedRoles];
        for (let role of req.roles) {
            if (validRoles.includes(role)) {
                next();
                return;
            }
        }

        return res.status(401).json({ "message": "you do not have permission to do that!" });
    }
};

module.exports = verifyRoles;