/**
 * Checks if the JWT exists in the request object. 
 * The reason the id is beeing looked after is because it is used in 
 * later requests. 
 */
module.exports = (req, res, next) => {
    if(!req.auth.data.id)
        return res.sendStatus(401);
    next();
}