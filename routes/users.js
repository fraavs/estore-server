const express = require('express');
const pool = require('../shared/pool');
const bcryptjs = require('bcryptjs');
const users = express.Router();


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
                                        message: error.messagea
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

module.exports = users;