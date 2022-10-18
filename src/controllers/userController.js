const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const joi = require('joi');
const prisma = new PrismaClient();

module.exports = {
    register: async (req, res) => {
        const validate = async (data) => {
            const schema = joi.object({
                full_name: joi.string().required(),
                email: joi.string().email().required(),
                password: joi.string().min(8).required(),
            }).unknown(true);
            return await schema.validate(data);
        }

        try {
            const { full_name, email, password } = req.body;
            const { error, value } = await validate(req.body);
            if (error) {
                let message = error.details[0].message.split('"');
                message = message[1] + message[2];
                res.status(400).send({
                    message: message,
                });
                return;
            }

            const checkEmailDuplicate = await prisma.users.findUnique({
                where: {
                    email
                }
            });

            if (checkEmailDuplicate) {
                res.status(400).json({
                    message: 'email has been registered!'
                });

                return;
            }

            const passwordHash = await bcrypt.hash(password, 10);
            const newUser = await prisma.users.create({
                data: {
                    full_name, email, password: passwordHash
                }
            });

            const payload = { id: newUser.id, email: newUser.email };
            const accessToken = jwt.sign(payload, process.env.JWT_TOKEN_SECRET);

            delete newUser.password;

            res.status(201).json({
                message: 'success register user!',
                data: {
                    user: newUser,
                    access_token: accessToken
                }
            });
        } catch (error) {
            res.status(500).send(error.message)
        }
    },
    login: async (req, res) => {
        const validate = async (data) => {
            const schema = joi.object({
                email: joi.string().email().required(),
                password: joi.string().min(8).required(),
            }).unknown(true);
            return await schema.validate(data);
        }

        try {
            const { email, password } = req.body;
            const { error, value } = await validate(req.body);
            if (error) {
                let message = error.details[0].message.split('"');
                message = message[1] + message[2];
                res.status(400).send({
                    message: message,
                });
                return;
            }

            const checkEmail = await prisma.users.findUnique({
                where: {
                    email
                }
            });

            if (checkEmail) {
                if (await bcrypt.compare(password, checkEmail.password)) {
                    delete checkEmail.password;
                    const payload = { id: checkEmail.id, email: checkEmail.email };
                    const accessToken = jwt.sign(payload, process.env.JWT_TOKEN_SECRET);

                    res.status(200).json({
                        message: 'success logged in',
                        data: {
                            user: checkEmail,
                            access_token: accessToken
                        }
                    });
                } else {
                    res.status(401).json({
                        message: 'password invalid',
                    })
                    return;
                }
            } else {
                res.status(401).json({
                    message: 'email not found in our records',
                });
                return;
            }
        } catch (error) {
            res.status(500).send(error.message)
        }
    },
    update_profile: async (req, res) => {
        const validate = async (data) => {
            const schema = joi.object({
                full_name: joi.string().required(),
            }).unknown(true);
            return await schema.validate(data);
        }

        try {
            const { full_name } = req.body;
            const { error, value } = await validate(req.body);
            if (error) {
                let message = error.details[0].message.split('"');
                message = message[1] + message[2];
                res.status(400).send({
                    message: message,
                });
                return;
            }

            const updateUser = await prisma.users.update({
                where: {
                    id: req.user.id
                },
                data: {
                    full_name
                }
            });

            delete updateUser.password;

            res.status(200).json({
                message: 'success update user profile',
                data: updateUser
            });

        } catch (error) {
            res.status(500).send(error.message)
        }
    },
    change_password: async (req, res) => {
        const validate = async (data) => {
            const schema = joi.object({
                old_password: joi.string().min(8).required(),
                new_password: joi.string().min(8).required(),
                new_password_confirm: joi.string().min(8).valid(joi.ref('new_password')).required(),
            }).unknown(true);
            return await schema.validate(data);
        }

        try {
            const { old_password, new_password, new_password_confirm } = req.body;
            const { error, value } = await validate(req.body);
            if (error) {
                let message = error.details[0].message.split('"');
                message = message[1] + message[2];
                res.status(400).send({
                    message: message,
                });
                return;
            }

            const checkUser = await prisma.users.findUnique({
                where: {
                    id: req.user.id
                }
            });

            if (!await bcrypt.compare(old_password, checkUser.password)) {
                res.status(200).json({
                    message: 'old password invalid!',
                    data: null
                });
                return;
            }

            if (new_password != new_password_confirm) {
                res.status(422).json({
                    message: 'new password not same password confirmation',
                    data: null
                });
                return;
            }

            const passwordHash = await bcrypt.hash(new_password, 10);
            await prisma.users.update({
                where: {
                    id: req.user.id
                },
                data: {
                    password: passwordHash
                }
            });

            res.status(200).json({
                message: 'success update password'
            });
        } catch (error) {
            res.status(500).send(error.message)
        }
    },
    profile: async (req, res) => {
        const user = await prisma.users.findUnique({
            where: {
                id: req.user.id
            }
        });

        delete user.password;

        res.status(200).json({
            message: 'success get user profile',
            data: user
        });
    }
}