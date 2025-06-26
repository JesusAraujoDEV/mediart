require('dotenv').config();
const UserService = require('./user_service');
const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { config } = require('../config/config');
const fs = require('fs');
const path = require('path');
const service = new UserService();

class AuthService{
    async getUser(email, password){
        const user = await service.findOneByEmail(email);
        if(!user){
            throw boom.unauthorized('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash); 
        if (!isMatch) {
            throw boom.unauthorized('Invalid credentials'); // Mensaje más descriptivo
        }

        delete user.dataValues.passwordHash;
        //delete user.dataValues.recoveryToken; 
        return user;
    }

    signToken(user){
        const payload = {
            sub: user.id
        }
        const token = jwt.sign(payload, config.jwtSecret); 
        return{
            user,
            token
        };
    }

    async sendRecovery(email){
        const user = await service.findOneByEmail(email);

        if(!user){
            console.warn(`Intento de recuperación de contraseña para correo no existente: ${email}`);
            return { message: 'Si el correo electrónico está registrado, recibirás un enlace para restablecer tu contraseña.' };
        }


        const payload = {
            sub: user.id
        };

        const token = jwt.sign(payload, config.jwtSecret, {expiresIn: '15min'});
        const link = `${config.clientUrl}recovery?token=${token}`;

        await service.update(user.id, {recoveryToken: token});

        const emailTemplatePath = path.join(__dirname, '..', 'templates', 'emails', 'recovery_email.html');
        let emailHtml = fs.readFileSync(emailTemplatePath, 'utf8');

        emailHtml = emailHtml.replace('{{recoveryLink}}', link);
        emailHtml = emailHtml.replace('{{currentYear}}', new Date().getFullYear().toString());

        const mail = {
                from: config.noReplyEmail,
                to: `${user.email}`,
                subject: "Recupera tu contraseña de Mediart",
                html: emailHtml
        }

        try {
            await this.sendMail(mail);
            return { message: 'Si el correo electrónico está registrado, recibirás un enlace para restablecer tu contraseña.' };
        } catch (error) {
            console.error('Error al enviar correo de recuperación:', error);
            throw boom.internal('Ocurrió un error al intentar enviar el correo de recuperación. Inténtalo de nuevo más tarde.');
        }
    }

    async changePassword(token, newPassword) {
        try {
            const payload = jwt.verify(token, config.jwtSecret);

            const user = await service.findOne(payload.sub, [], true);

            if (!user || !user.recoveryToken) {
                console.warn(`Intento de cambio de contraseña con token inválido o usado para userId: ${payload.sub}`);
                throw boom.unauthorized('Invalid or already used recovery token. Please request a new one.');
            }

            if (user.recoveryToken !== token) {
                console.warn(`Discrepancia de recoveryToken para userId: ${payload.sub}. Token DB: ${user.recoveryToken}, Token Request: ${token}`);
                throw boom.unauthorized('Invalid recovery token. Please request a new one.');
            }

            const hash = await bcrypt.hash(newPassword, 10);
            await service.update(user.id, {
                recoveryToken: null,
                passwordHash: hash
            });
            return { message: 'Password changed!' }
        }
        catch{
            throw boom.unauthorized();
        }
    }

    async sendMail(infoMail){
        const transporter = nodemailer.createTransport(
            {
            host: "smtp.gmail.com",
            secure: true,
            port: 465,
            auth: {
                user: config.noReplyEmail,      // <-- ¡Cambio aquí!
                pass: config.emailAppPassword   // <-- ¡Cambio aquí!
            }
            }
        );

        await transporter.sendMail(infoMail);
        return { message: 'Mail SENT!' };
    }
}

module.exports = AuthService