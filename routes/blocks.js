// Dedicated file for handling routes
var express = require('express');
// Returns router instance that can be mounted as middleware
var router = express.Router();
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({ extended: false});

// Blocks as objects with descriptions
var blocks = {
    'Fixed': 'Fastened securely in position',
    'Movable': 'Capable of being moved',
    'Rotating': 'Moving in a circle around its center'
};

var locations = {
    'Fixed': 'First Floor',
    'Movable': 'Second floor',
    'Rotating': 'Third floor'
};

// The root path relative to the path where its mounted
// app.use('/blocks') in middleware.js
router.route('/')
    .get(function(request, response) { // lines with a dot indicate function calls
        var blocks = ['Fixed', 'Movable', 'Rotating'];
        // query string param to limit number of blocks returned
        if (request.query.limit >= 0) {
            response.json(blocks.slice(0, request.query.limit))
        } else {
            response.json(blocks);
        }
    })
    .post(parseUrlencoded, function(request, response) {
        var newBlock = request.body;
        blocks[newBlock.name] = newBlock.description;
    
        // Sets 201 created status, repsonse with new block name
        response.status(201).json(newBlock.name);
    });
    // .route, .get, and .post are chained together now
    // Chaining means calling functions on the return of previous functions

// Dynamic route
router.route('/:name')
// .all operates the same as app.param
    .all(function(request, response, next) {
        var name = request.params.name;
        var block = name[0].toUpperCase() + name.slice(1).toLowerCase();
        request.blockName = block;
        next();
    })
    .get(function(request, response) {
        var description = blocks[request.blockName];
        // Returns error 404 if 'name' not found
        if (!description) {
            response.status(404).json('No description found for ' + request.params.name);   
        } else {
            response.json(description);    
        }
    })
    .delete(function(request, response) {
        delete blocks[request.blockName];
        response.sendStatus(200);    
    });
    
router.route('/:locations')
    .get(function(request, response) {
        var location = locations[request.blockName];
        
        if (!location) {
            response.status(404).json('No location found for ' + request.params.name);   
        } else {
            response.json(location);    
        }
    });        

module.exports = router;