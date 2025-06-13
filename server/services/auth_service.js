require('dotenv').config();
const UsersService = require('./user_service');
const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { config } = require('../config/config');

const service = new UsersService();

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
            throw boom.unauthorized();
        }

        const payload = {
            sub: user.id
        };

        const token = jwt.sign(payload, config.jwtSecret, {expiresIn: '15min'}); 
        const link = `http://myfrontend.com/recovey?token=${token}`;

        await service.update(user.id, {recoveryToken: token});

        const mail = {
                from: process.env.EMAIL_TESTING,        // Remitente: Tu correo de Gmail
                to: `${user.email}`,  // Destinatario: El otro correo que tienes en .env
                subject: "Email para recuperar la contraseña ! ✔",
                html: `<b>Ingresa a este link... => ${link} jeje<b>`
        }

        const rta = await this.sendMail(mail);
        return rta;
    }

    async changePassword(token, newPassword){
        try{
            const payload = jwt.verify(token, config.jwtSecret);
            const user = await service.findOne(payload.sub);
            if(user.recoveryToken !== token){
                throw boom.unauthorized();
            }
            const hash = await bcrypt.hash(newPassword, 10);
            await service.update(user.id, {
                recoveryToken: null,
                password: hash
            });
            return { message: 'password changed!' }
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
                user: process.env.EMAIL_TESTING,
                pass: process.env.PASSWORD_APP
            }
            }
        );

        await transporter.sendMail(infoMail);
        return { message: 'Mail SENT!' };
    }
}

module.exports = AuthService