const express = require('express');
const pool = require('../shared/pool');
const bcryptjs = require('bcryptjs');
const users = express.Router();
const jwtoken = require('jsonwebtoken');


users.post('/signup', (req, res) => {
    try {
        let username = req.body.username;
        let email = req.body.email;
        let firstName = req.body.firstName;
        let lastName = req.body.lastName;
        let password = req.body.password;

        pool.query(`select count(*) as count from users where email like '${email}'`,
            (error, resultCount) => {
                if (error) {
                    res.status(500).send({
                        error: error.code,
                        message: error.message,
                    });
                } else {
                    if (resultCount[0].count > 0) {
                        res.status(200).send({ message: 'Email already exists' });
                    } else {
                        bcryptjs.hash(password, 10).then((hashPassword) => {
                            const query = `Insert into users
                            (email,firstName,lastName,username,password) values (
                            '${email}','${firstName}','${lastName}','${username}','${hashPassword}')`;
                            pool.query(query, (error, result) => {
                                if (error) {
                                    res.status(401).send({
                                        error: error.code,
                                        message: error.message,
                                    }
                                    );
                                } else {
                                    res.status(201).send({ message: 'success' });
                                }
                            });
                        });
                    }
                }
            }
        )
    } catch (error) {
        res.status(400).send({
            error: error.code,
            message: error.message,
        });
    }
});

users.post('/login', (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        // Check if email is provided
        if (!email || !password) {
            return res.status(400).send({
                message: 'Email and password are required.',
            });
        }

        // Query the database for the user
        pool.query(`select * from users where email like '${email}'`, (error, result) => {
            if (error) {
                res.status(500).send({
                    error: error.code,
                    message: error.message,
                });
            } else {
                if (result.length > 0) {
                    bcryptjs
                        .compare(password, result[0].password)
                        .then(compareResult => {
                            if (compareResult) {
                                const token = jwtoken.sign(
                                    {
                                        id: result[0].id,
                                        email: result[0].email,
                                    },
                                    'estore-secret-key',
                                    { expiresIn: '1h' }
                                );

                                res.status(200).send({
                                    token: token,
                                    expiresInSeconds: 3600,
                                    user: {
                                        firstName: result[0].firstName,
                                        lastName: result[0].lastName,
                                        username: result[0].username,
                                    },
                                });
                            } else {
                                res.status(401).send({
                                    message: 'Invalid password.',
                                });
                            }
                        });
                } else {
                    res.status(401).send({
                        message: `User doesn't exist.`,
                    });
                }
            }
        });
    } catch (error) {
        res.status(400).send({
            error: error.code,
            message: error.message,
        });
    }
});

users.get('/userInfo', (req, res) => {
    try {
        // Query the database to get all registered users
        pool.query('SELECT * FROM users', (error, results) => {
            if (error) {
                res.status(500).send({
                    error: error.code,
                    message: error.message,
                });
            } else {
                // Send the list of registered users to the frontend
                res.status(200).send({ users: results });
            }
        });
    } catch (error) {
        res.status(400).send({
            error: error.code,
            message: error.message,
        });
    }
});

module.exports = users;