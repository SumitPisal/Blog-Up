const JWT = require('jsonwebtoken')

const secret  = "$umit@123";

function createJwtToken(user) {
    const payload = {
        _id : user._id,
        profileImageUrl : user.profileImageUrl,
        email : user.email,
        role : user.role,
    };
    const token  = JWT.sign(payload,secret);
    return token;
}

function verifyToken(token) {
    const payload = JWT.verify(token,secret);
    return payload;
}

module.exports = {
    createJwtToken,
    verifyToken,
}