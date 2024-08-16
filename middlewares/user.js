const {verifyToken} = require('../services/authentication'); 

function chechforAuthentication (cookieName) {
   return (req,res,next) => {
    const tokenValue  = req.cookies[cookieName];
    if(!tokenValue)  {
        next();
    }
   
 // here we go to the next as user doesn't have the token value and
  // req.user is also empty so in next step user cannot access it.
    try {
        const userPayload  = verifyToken(tokenValue);
        req.user = userPayload;
    } 
    catch (error) {
        res.send('error');
      }
    next();
   }
   
}

module.exports = {
    chechforAuthentication,
}