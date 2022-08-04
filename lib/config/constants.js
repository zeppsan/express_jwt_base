
/* 
 * Constats that is used throughtout the application should be listed here. 
 */
module.exports = {
    WRONG_CREDENTIALS: "The username or password were incorrect.",
    HASHING_ERROR: "There was an error in the system. Please contact the support",
    INVALID_REFRESHTOKEN: "Your refreshtoken is invalid.",
    USER_ALREADY_EXISTS: "The email or username you entered already exists.",
    INVALID_VERIFICATION: "The verification link you clicked is invalid.",
    EMAIL_VERIFIED: "Your email has been verified",
    validation: {
        alphga_numeric: "{{#label}} must only contain alpha-numeric characters.",
        too_short: "{{#label}} is too short.",
        too_long: "{{#label}} is too long.",
        field_required: "{{#label}} is a required field.",
        regex_missmatch: "{{#label}} does not meet the regex requirement",
        pattern: "{{#label}} does not meet the regex requirement",
        email: "The entered email is not valid"
    },
    MAX_IMAGE_SIZE: 2048*1000
}