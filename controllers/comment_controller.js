var models = require('../models/models.js');

// GET /quizzes/:quizId/comments/new
exports.new = function (req, res) {
  res.render('comments/new.ejs', { quizid: req.params.quizId, errors: [] });
};

// GET /quizzes/:quizId/comments/new
exports.create = function (req, res) {
  var comment = models.Comment.build(
    { texto: req.body.comment.texto,
      QuizId: req.params.quizId
    }
  );

  comment.validate()
  .then(
    function (err) {
      if (err) {
        res.render( 'comments/new.ejs', {
          comment: comment, quizid: req.params.quizId, errors: err.errors
        });
      } else {
        // save: guarda en la DB el campo de texto de comment
        comment.save()
        .then( function () { res.redirect('/quizzes/' + req.params.quizId); });
      } // res.redirect: Redirección HTTP a la lista de preguntas
    }
  ).catch(function (error) { next(error); });
};
