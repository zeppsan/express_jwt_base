const models = require('../models/index')
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const constants = require('../config/constants')
const saltRounds = 6;
var jwt = require('jsonwebtoken');

/**
 * Takes in userData as an object. Must contain email and password. Data validation is expected to be done before this stage. 
 * @param {*} userData 
 * @returns user, authToken, refreshToken
 */
exports.submitLogin = (userData) => {
    return new Promise(async(resolve, reject) => {
        const user = await models.User.findOne({ where: { email: userData.email } });

        if (!user)
            return reject(constants.WRONG_CREDENTIALS)

        bcrypt.compare(userData.password, user.password, async(error, result) => {
            if (error) { return reject(error) }
            if (!result)
                return reject(constants.WRONG_CREDENTIALS)

            return resolve(await models.User.scope('safe').findOne({ where: { id: user.id } }))
        })
    })
}

/**
 * Issues a authToken with the payload "user". 
 */
exports.getAuthToken = async(user) => {
    const authToken = await generateToken(user, process.env.JWT_TOKEN_LIFETIME)
    return authToken;
}

/**
 * Issues a refreshToken with the payload "user". 
 */
exports.getRefreshToken = async(user) => {
    /* Create refreshtoken */
    const refreshToken = await generateToken(user, process.env.REFRESH_TOKEN_LIFETIME);
    try {
        const potentialToken = await models.RefreshToken.findOne({ where: { userId: user.dataValues.id } })
        if (potentialToken) {
            await potentialToken.update({ token: refreshToken })
        } else {
            await models.RefreshToken.create({
                userId: user.dataValues.id,
                token: refreshToken
            })
        }
    } catch (error) {
        console.log(error);
    }
    return refreshToken;
}

/**
 * Creatres a token that can be used for authorization or refreshtoken.
 * @param {UserObject} userData 
 * @param {Seconds} expireTime 
 */
const generateToken = (userData, expireTime) => {
    const token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + parseInt(expireTime),
        data: userData
    }, process.env.JWTSECRET);
    return token;
}

/**
 * Takes in userData as an object. Must contain email, password and username. Data checking is expected to be done before this stage. 
 */
exports.submitRegistration = (userData) => {
    return new Promise(async(resolve, reject) => {

        /* Checks if the username or email already exists in the database. */
        const userCheck = await models.User.findOne({
            where: {
                [models.Sequelize.Op.or]: [
                    { email: userData.email },
                    { username: userData.username }
                ]
            }
        })
        if (userCheck)
            return reject(constants.USER_ALREADY_EXISTS)

        /* Hash password and enter into database. */
        bcrypt.hash(userData.password, saltRounds, async(error, hashedPassword) => {
            if (error) { return reject(constants.HASHING_ERROR) }
            userData.password = hashedPassword;
            const userObject = await models.User.create(userData);

            /* Fetch the created model but with the safe scope. */
            const returnableObject = await models.User.scope('safe').findOne({ where: { id: userObject.id } })
            return resolve(returnableObject);
        })
    })
}

/**
 * Looks up the owner of the provided refreshToken.
 */
exports.getUserFromRefreshToken = (refreshToken) => {
    return new Promise(async(resolve, reject) => {
        const token = await models.RefreshToken.findOne({ where: { token: refreshToken } })
        if (!token)
            return reject(constants.INVALID_REFRESHTOKEN)

        const user = await models.User.scope('safe').findOne({ where: { id: token.userId } })
        return resolve(user);
    })
}

/**
 * email verification. Checks DB for token
 */
exports.verifyEmailVerification = (token) => {
    return new Promise(async(resolve, reject) => {
        const verificationEntry = await models.Verifications.findOne({
            where: { token: token }
        })

        if (!verificationEntry)
            return reject(constants.INVALID_VERIFICATION)

        await models.User.update({ email_verified: 1 }, { where: { id: verificationEntry.userId } })
        await models.Verifications.destroy({ where: { id: verificationEntry.id } })
        resolve(verificationEntry);
    })
}