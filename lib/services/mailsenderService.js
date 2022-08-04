const models = require('../models/index')
const crypto = require('crypto')
const constants = require('../config/constants')
const Recipient = require("mailersend").Recipient;
const EmailParams = require("mailersend").EmailParams;
const MailerSend = require("mailersend");

const mailersend = new MailerSend({
    api_key: process.env.MAILERAPI,
});

exports.sendEmailVerificationMail = (user) => {
    return new Promise(async (resolve, reject) => {

        /* Create email verification entry */
        const verificationEntry = await models.Verifications.create({
            userId: user.id,
            verificationType: "EMAIL",
            email: user.email,
            token: await crypto.randomBytes(32).toString('hex')
        })

        const emailParams = new EmailParams()
        .setFrom(process.env.MAILER_FROM_EMAIL)
        .setFromName(process.env.MAILER_FROM_NAME)
        .setRecipients([new Recipient(user.email, user.username)])
        .setSubject('E-post verifiering')
        .setTemplateId('template_id')
        .setVariables([
            {
                email: user.email,
                substitutions: [
                  {
                    var: 'action_url',
                    value: process.env.APP_URL + '/auth/verifyemail?token='+verificationEntry.token
                  }
                ],
            }
        ])

        mailersend.send(emailParams);
        resolve("");
    })
}