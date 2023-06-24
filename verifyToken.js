const jwt = require("jsonwebtoken");
const { createError } = require("./error.js");

const verifyToken = async (req, res, next) => {
    const token = req.cookies?.access_token;

    if (!token)
    {
        return res.redirect('/auth/login');
    }

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, user) => {
            if (err) {
                return next(createError(401, 'Invalid Token'));
            }

            req.user = user.user._id
        }
    )

    next();
}

module.exports = verifyToken