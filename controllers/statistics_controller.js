var models = require('../models/models.js');

// GET /quizes/statistics
exports.show = function(req, res, next) {
	models.Quiz.findAll().then(function(quizes){
		models.Comment.findAll().then(function(comments){
			var nc = avg = q_with = q_without = 0;
			var c_qid = [];

			for(var i=0; i < comments.length; i++) {
				if (comments[i].published == true) {
					nc++;
					c_qid.push(comments[i].quizId);
				}
			}
			for (var j=0; j < quizes.length; j++) {
				if (c_qid.indexOf(quizes[j].id) >= 0) {
					q_with++;
				}
				else {
					q_without++;
				}
			}
	  		avg = (nc / quizes.length);

	  		res.render('quizes/stats', {
	  			quizes: quizes,
	  			comments: nc,
	  			avg: avg,
	  			q_with: q_with,
	  			q_without : q_without,
	  			errors: []
	  		});
    	}).catch (function (error) { next(error)});
	}).catch (function (error) { next(error)});
};
