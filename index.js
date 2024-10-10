import express from 'express';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import jsonwebtoken from 'jsonwebtoken';

const port = process.env.PORT || 5000;

const app = express();

function sendContentType(res) {
    res.set('Content-Type', 'image/jpeg');
}

function sendFile(res, filePath) {
    res.sendFile(path.resolve(`./${filePath}`));
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

app.get('/PHOTO_PASS', (req, res) => {
    sendContentType(res);
    sendFile(res, 'images/pass.jpg');
});

app.get('/PHOTO_EYES', (req, res) => {
    sendContentType(res);
    sendFile(res, 'images/photo-eyes-closed.jpg');
});

app.get('/PHOTO_BACK', (req, res) => {
    sendContentType(res);
    sendFile(res, 'images/background-issue.jpg');
});

app.get('/PHOTO_OVERRIDE', (req, res) => {
    sendContentType(res);
    sendFile(res, 'images/override.jpg');
});

app.get('/PHOTO_FAIL', (req, res) => {
    sendContentType(res);
    sendFile(res, 'images/fail.jpg');
});

app.get('/PHOTO_COLOR', (req, res) => {
    sendContentType(res);
    sendFile(res, 'images/unnatural-colors.jpg');
});

app.get('/PHOTO_BIG', (req, res) => {
    sendContentType(res);
    sendMime(res);
    sendData(res, 11);
    res.end();
});

app.get('/PHOTO_SLW', (req, res) => {
    setTimeout(() => {
        sendContentType(res);
        sendMime(res);
        sendData(res, 1);
        res.end();
    }, 40000);
});

app.get('/PHOTO_BDY', (req, res) => {
    sendContentType(res);
    sendMime(res);
    sendData(res, 2);
    res.flushHeaders();
    setTimeout(() => {
        sendData(res, 1);
        res.end();
    }, 40000);
});

app.get('/PHOTO_JWT', async (req, res) => {
    const authHeader = req.header('Authorization');
    const match = /^Bearer (.*)$/.exec(authHeader);
    const token = match && match[1];

    if (!token) return res.status(500).send(`No token ${authHeader}`);

    const cert = await readFile(path.resolve('./photo-code-auth-key.pub'));

    jsonwebtoken.verify(token, cert, {
        issuer: 'HMPO',
        subject: 'https://bit.ly/4eCi2Cv'
    }, (err, decoded) => {
        if (err) return res.status(403).send(`Bad JWT token ${token} ${err.message}`);
        res.set('X_JWT_RAW', JSON.stringify(decoded));

        sendContentType(res);
        sendFile(res, 'images/pass.jpg');
    });
});

app.listen(port);
console.log(`Listening on port ${port}`)
