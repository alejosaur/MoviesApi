import express from 'express';
import bodyParser from 'body-parser';

import db from './db/db';// Set up the express app
const app = express();// get all todos

var fs = require('fs');
var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');

const classifier_ids = ["DefaultCustomModel_1909949655"];
const threshold = 0.2;

var visualRecognition = new VisualRecognitionV3({
	version: '2018-03-19',
	iam_apikey: 'NdKpl8oYJlgsk5Jw1PedLgBZb37_oZsNIQlK0UgV2F9z'
});

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/api/v1/movies', (req, res) => {
  res.status(200).send({
    success: 'true',
    message: 'movies retrieved successfully',
    movies: db
  })
}); const PORT = 5000;

app.get('/api/v1/movies/:id', (req, res) => { 
  const id = parseInt(req.params.id, 10);
  db.map((movie) => {
    if (movie.id === id) {
      return res.status(200).send({
        success: 'true',
        message: 'movie retrieved successfully',
        movie,
      });
    }
  });
  return res.status(404).send({   
    success: 'false',   
    message: 'movie does not exist',  
  });
});

app.post('/api/v1/movies', (req, res) => {
  if (!req.body.title) {
    return res.status(400).send({
      success: 'false',
      message: 'title is required',
    });
  } 

  const todo = {
    id: db.length + 1,
    title: req.body.title,
    director: req.body.director,
    date: req.body.date,
    income: req.body.income,
    time: req.body.time,
    gender: req.body.gender
  };
  
  db.push(todo);
  return res.status(201).send({
    success: 'true',
    message: 'movie added successfully',
    todo,
  });
});

app.put('/api/v1/movies/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  let movieFound;
  let itemIndex;
  db.map((movie, index) => {
    if (movie.id === id) {
      movieFound = movie;
      itemIndex = index;
    }
  });

  if (!movieFound) {
    return res.status(404).send({
      success: 'false',
      message: 'movie not found',
    });
  }

  const newMovie = {
    id: movieFound.id,
    title: req.body.title || movieFound.title,
    director: req.body.director || movieFound.director,
    date: req.body.date || movieFound.date,
    income: req.body.income || movieFound.income,
    time: req.body.time || movieFound.time,
    gender: req.body.gender || movieFound.gender,
  };

  db.splice(itemIndex, 1, newMovie);

  return res.status(201).send({
    success: 'true',
    message: 'movie added successfully',
    newMovie,
  });
});

app.delete('/api/v1/movies/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  let movieFound;
  let itemIndex;
  db.map((movie, index) => {
    if (movie.id === id) {
      movieFound = movie;
      itemIndex = index;
    }
  });

  if (!movieFound) {
    return res.status(404).send({
      success: 'false',
      message: 'movie not found',
    });
  }
  db.splice(itemIndex, 1);

  return res.status(200).send({
    success: 'true',
    message: 'movie deleted successfuly',
  });
});

app.listen(process.env.PORT || 5000)
