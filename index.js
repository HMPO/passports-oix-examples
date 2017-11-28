'use strict';

const PORT = process.env.PORT || 5000;

const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');

let app = new express();

function sendHeader(res) {
    res.set('Content-Type', 'image/jpeg');
}

function sendMime(res) {
    res.write(Buffer.from([0xFF, 0xD8, 0xFF]));
}

function sendData(res, meg) {
    let k;
    for (k = 0; k < meg * 1024; k++) {
        res.write(Buffer.from(new Array(1024)));
    }
}

app.get('/PHOTOOK', (req, res, next) => {
    sendHeader(res);
    res.sendFile(__dirname + '/f1_pass.jpg');
});

app.get('/PHOTOBAD', (req, res, next) => {
    sendHeader(res);
    res.sendFile(__dirname + '/f4_smiling.jpg');
});

app.get('/PHOTOBIG', (req, res, next) => {
    sendHeader(res);
    sendMime(res);
    sendData(res, 11);
    res.end();
});

app.get('/PHOTOSLW', (req, res, next) => {
    setTimeout(() => {
        sendHeader(res);
        sendMime(res);
        sendData(res, 1);
        res.end();
    }, 40000);
});

app.get('/PHOTOBDY', (req, res, next) => {
    sendHeader(res);
    sendMime(res);
    sendData(res, 2);
    res.flush();
    setTimeout(() => {
        sendData(res, 1);
        res.end();
    }, 40000);
});

app.get('/PHOTOJWT', (req, res, next) => {
    let authHeader = req.header('authorization');
    let match = /^Bearer (.*)$/.exec(authHeader);
    let token = match && match[1];

    if (!token) return res.status(500).send('No token ' + authHeader);

    let cert = fs.readFileSync(__dirname + '/photo-code-auth-key.pub');
    jwt.verify(token, cert, {
        issuer: 'HMPO',
        subject: 'https://bit.ly/2A0ozHh'
    }, (err, decoded) => {
        if (err) return res.status(403).send('Bad JWT token ' + token + ' ' + err.message);
        res.set('X_JWT_RAW', JSON.stringify(decoded));

        sendHeader(res);
        res.sendFile(__dirname + '/f1_pass.jpg');
    });
});


app.listen(PORT);

