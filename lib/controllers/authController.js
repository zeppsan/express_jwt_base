const authServices = require('../services/authService');
const mailsenderService = require('../services/mailsenderService');
const constants = require('../config/constants')
var jwt = require('jsonwebtoken');
const validation = require('../validators/authSchemas')
const userController = require('../controllers/userController');

/**
 * Takes email and password to authenticate a user. 
 * Returns authToken and sets a refresh_token cookie if authentication were successfull.
 */
exports.login = async(req, res) => {

    /* Validates the input agains the joi-instructions */
    try {
        await validation.loginValidation.validateAsync(req.body);
    } catch (error) {
        return res.status(400).json({
            message: error
        })
    }

    authServices.submitLogin({
            email: req.body.email,
            password: req.body.password
        })
        .then(async(user) => {
            setRefreshTokenCookie(res, await authServices.getRefreshToken(user));
            res.status(200).json({
                user: user,
                token: await authServices.getAuthToken(user)
            })
        })
        .catch(errorMessage => {
            res.status(401).json({
                message: errorMessage
            })
        })
}

/**
 * Takes username, email and password and registers an user to the database. 
 */
exports.register = async(req, res) => {

    /* Validates the input agains the joi-instructions */
    try {
        await validation.registrationValidation.validateAsync(req.body)
    } catch (error) {
        return res.status(400).json({
            message: error
        })
    }

    authServices.submitRegistration({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        })
        .then(async(userObject) => {
            res.status(201).json(userObject)
                //  await userController.afterRegistration(userObjet)
                // await mailsenderService.sendEmailVerificationMail(userObjet)
        })
        .catch(errorMessage => {
            res.status(400).json({ message: errorMessage })
        })
}

/**
 * Issues a new authToken and creates a new RefreshToken as well.
 */
exports.refreshToken = async(req, res) => {
    
    /* If a refresh_token is missing from the signed cookies list, exit. */
    if (!req.signedCookies.refresh_token) {
        return res.status(401)
            .json({
                message: "Refresh_token Cookie missing"
            })
    }

    /* Verify that the signed cookie is valid. If unvalid, clear cookie and exit. */
    jwt.verify(req.signedCookies.refresh_token, process.env.JWTSECRET, (err, result) => {
        if (err) {
            res.clearCookie("refresh_roken");
            return res.status(400)
                .json({
                    message: "Invalid refresh token"
                })
        }

        /* Find the user and issue a new refresh token. */
        authServices.getUserFromRefreshToken(req.signedCookies.refresh_token)
            .then(async(user) => {
                setRefreshTokenCookie(res, await authServices.getRefreshToken(user));
                res.status(200).json({
                    user: user,
                    token: await authServices.getAuthToken(user)
                })
            })
            .catch(error => {
                /* In case of an error, clear cookies and exit. */
                res.clearCookie("refresh_roken");
                res.status(401).json({
                    message: error
                })
            })
    })
}

/**
 * Sets a signed refresh token cookie.
 */
const setRefreshTokenCookie = (res, token) => {
    res.cookie('refresh_token', token, {
        maxAge: process.env.REFRESH_TOKEN_LIFETIME * 1000,
        signed: true,
        crossDomain: true
    })
}

/**
 * Email verification
 */
exports.verifyEmail = async(req, res) => {

    /* Validates the input agains the joi-instructions */
    try {
        await validation.refreshTokenValidation.validateAsync(req.query)
    } catch (error) {
        return res.json({
            message: error
        }).status(400)
    }

    /* Verifies that the link is correct. If so, mark the user as verified. */
    authServices.verifyEmailVerification(req.query.token)
        .then(verificationObject => {
            res.json({
                message: constants.EMAIL_VERIFIED
            }).status(200);
        })
        .catch(error => {
            res.json({
                message: error
            }).status(403)
        })
}