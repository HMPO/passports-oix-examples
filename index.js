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

app.get('/PHOTO_PASS', (req, res, next) => {
    sendHeader(res);
    res.sendFile(__dirname + '/images/pass.jpg');
});

app.get('/PHOTO_EYES', (req, res, next) => {
    sendHeader(res);
    res.sendFile(__dirname + '/images/photo-eyes-closed.jpg');
});

app.get('/PHOTO_BACK', (req, res, next) => {
    sendHeader(res);
    res.sendFile(__dirname + '/images/background-issue.jpg');
});

app.get('/PHOTO_OVERRIDE', (req, res, next) => {
    sendHeader(res);
    res.sendFile(__dirname + '/images/override.jpg');
});

app.get('/PHOTO_FAIL', (req, res, next) => {
    sendHeader(res);
    res.sendFile(__dirname + '/images/fail.jpg');
});

app.get('/PHOTO_BIG', (req, res, next) => {
    sendHeader(res);
    sendMime(res);
    sendData(res, 11);
    res.end();
});

app.get('/PHOTO_SLW', (req, res, next) => {
    setTimeout(() => {
        sendHeader(res);
        sendMime(res);
        sendData(res, 1);
        res.end();
    }, 40000);
});

app.get('/PHOTO_BDY', (req, res, next) => {
    sendHeader(res);
    sendMime(res);
    sendData(res, 2);
    res.flush();
    setTimeout(() => {
        sendData(res, 1);
        res.end();
    }, 40000);
});

app.get('/PHOTO_JWT', (req, res, next) => {
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
        res.sendFile(__dirname + '/images/pass.jpg');
    });
});


app.listen(PORT);

