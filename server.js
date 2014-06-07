#!/bin/env node

var express = require('express');
var fs = require('fs');
var mongodb = require('mongodb');

var App = function() {

    // Scope
    var self = this;

    // Setup
    self.dbServer = new mongodb.Server(process.env.OPENSHIFT_MONGODB_DB_HOST || "localhost", parseInt(process.env.OPENSHIFT_MONGODB_DB_PORT || 27017));
    self.db = new mongodb.Db('test', self.dbServer, {
        auto_reconnect: true
    });
    self.dbUser = process.env.OPENSHIFT_MONGODB_DB_USERNAME || "admin";
    self.dbPass = process.env.OPENSHIFT_MONGODB_DB_PASSWORD || "admin";

    self.ipaddr = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
    self.port = parseInt(process.env.OPENSHIFT_NODEJS_PORT) || 8080;


    self.routes = {};


    self.routes['root'] = function(req, res) {
        res.setHeader("Content-Type", "text/html");
        res.send('<h1>hello world nodejs+mongodb API</h1><p><a href="helloworld">Get Mongodb Hello Word</a></p>');
    };

    //returns all the parks in the collection
    self.routes['helloworld'] = function(req, res) {
        console.log(self.db.collection('helloworld').find({}).fields);
        self.db.collection('helloworld').find({}).toArray(function(err, docs) {
            res.header("Content-Type:", "application/json");
            res.end(JSON.stringify(docs));
        });
    };

    self.app = express();
    self.app.get('/helloworld', self.routes['helloworld']);
    self.app.get('/', self.routes['root']);

    self.connectDb = function(callback) {
        self.db.open(function(err, db) {
            self.db.authenticate(self.dbUser, self.dbPass, {
                authdb: "admin"
            }, function(err, res) {

                if (err) {
                    console.log("mongodb connected auth error");
                    throw err
                };
                console.log("mongodb connected");
                callback();
            });
        });
    };


    //starting the nodejs server with express
    self.startServer = function() {
        self.app.listen(self.port, self.ipaddr, function() {
            console.log('%s: Node server started on %s:%d ...', Date(Date.now()), self.ipaddr, self.port);
        });
    }

};

//make a new express app
var app = new App();

//call the connectDb function and pass in the start server command
app.connectDb(app.startServer);