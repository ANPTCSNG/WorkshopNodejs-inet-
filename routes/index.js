
const mongoose = require('mongoose');
var express = require('express');
var router = require('express').Router();


router.get('/test-db', (req, res) => {
    const state = mongoose.connection.readyState;

    if (state === 1) {
        return res.status(200).json({
            status: 200,
            message: 'MongoDB Connected',
            database: mongoose.connection.name
        });
    }

    return res.status(503).json({
        status: 503,
        message: 'MongoDB Not Connected'
    });
});

module.exports = router;