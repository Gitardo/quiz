var models = require('../models/models.js');

// GET /quizes/:quizId/comments/new
exports.new = function(req, res) {
  res.render('comments/new.ejs', {quizid: req.params.quizId, errors: []});
};

// POST /quizes/:quizId/comments
exports.create = function(req, res) {
  var comment = models.Comment.build(
    { text:  req.body.comment.text,
      quizId: req.params.quizId
    });

  comment
  .validate()
  .then(
    function(err){
      if(err) {
        res.render('comments/new.ejs', {comment: comment, quizid: req.params.quizId, errors: err.errors});
      } else {
        comment  // save: guarda en DB campo de texto de comment
        .save({fields: ["text", "quizId"]})
        .then( function(){ res.redirect('/quizes/'+req.params.quizId);
        });  // res.redirect: Redirección HTTP a lista de preguntas
      }
    }).catch(function(error){next(error)});
};
