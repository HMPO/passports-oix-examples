'use strict';

const PORT = process.env.PORT || 5000;

const express = require('express');

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
    res.end();
}

app.get('/PHOTOBIG', (req, res, next) => {
    sendHeader(res);
    sendMime(res);
    sendData(res, 11);
});

app.get('/PHOTOSLW', (req, res, next) => {
    setTimeout(() => {
        sendHeader(res);
        sendMime(res);
        sendData(res, 1);
    }, 40000);
});

app.get('/PHOTOBDY', (req, res, next) => {
    sendHeader(res);
    sendMime(res);
    setTimeout(() => {
        sendData(res, 1);
    }, 40000);
});

app.listen(PORT);

