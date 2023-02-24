
/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: ______Sukhvinder________________ Student ID: ___159790211___________ Date: ___20/01/2023_____________
*  Cyclic Link: ________https://doubtful-tiara-colt.cyclic.app_______________________________________________________
*
********************************************************************************/ 

const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require('dotenv').config();

const app = express();
const HTTP_PORT = process.env.PORT || 8080;
const mongoose = require('mongoose')
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();
db.initialize(process.env.MONGODB_CONN_STRING)

app.listen(process.env.PORT||3000)

app.get('/', (req, res) => {
    res.json({message : "API Listening"});
});

app.post('/api/movies', (req, res) => {
    db.addNewMovie(req.body).then(()=>{
        res.status(200).send("New Movie Added Successfully");
    }).catch((err)=>{
        res.status(500).send(`Movie Wasnt added successfully : ` + {err});
    })
});

app.get('/api/movies', (req, res) => {
    db.getAllMovies(req.query.page, req.query.perPage, req.query.title).then((data)=>{
        if(data.length == 0)
        {
            res.status(404).json({error : "Unable to find requested movie"});
        }
        else
        {
            res.status(200).json(data);
        }
    }).catch((err)=>{
        res.status(500).send('Unable to return movies : ' + {err});
    })
});

app.get('/api/movies/:_id', (req, res) => {
    db.getMovieById(req.params._id).then((data)=>{
        res.status(200).json(data);
    }).catch((err)=>{
        res.status(500).send(`Unable to return movie by requested id : ` + {err});
    })
});

app.put('/api/movies/:_id', (req, res) => {
    db.updateMovieById(req.body, req.params._id).then(()=>{
        res.status(200).send(`Updated the requested movie of id : ` + req.params._id);
    }).catch((err)=>{
        res.status(500).send(`Unable to update movie by requested id : ` + {err});
    })
});


app.delete('/api/movies/:_id', (req, res) => {
    db.deleteMovieById(req.params._id)
    .then(()=>{
        res.status(200).send(`Deleted the requested movie of id : ` + req.params._id);
    })
    .catch((err)=>{
        res.status(500).send(`Unable to delete movie by requested id : ` + {err});
    })
});



db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
        //console.log(process.env.MONGODB_CONN_STRING);
    });
}).catch((err)=>{
    console.log(err);
});




