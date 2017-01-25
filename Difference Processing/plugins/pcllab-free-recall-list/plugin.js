/**
 * @name Free Recall List
 *
 * @param {string} [title] - The optional title
 *
 * @param {string} [instructions] - The instructions
 *
 * @desc Put all the short answer questions required by your experiment in the a json file and reference it by the url and label.
 *
 * @author Mehran Einakchi https://github.com/LOG67
 */

 jsPsych.plugins["pcllab-free-recall-list"] = (function() {

	var plugin = {};

	plugin.trial = function(display_element, trial) {

		// set default values for parameters
		trial.instructions = trial.instructions || 'Please enter as many words as you can remember.';

		// allow variables as functions
		// this allows any trial variable to be specified as a function
		// that will be evaluated when the trial runs. this allows users
		// to dynamically adjust the contents of a trial as a result
		// of other trials, among other uses. you can leave this out,
		// but in general it should be included
		trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

    var words = [];
    var firstKeyTimes = [];

    var startTime = Date.now();
    var firstKeyTime = -1;

    // title
    if (trial.title) {
      var titleView = $('<h2>', {
        class: 'pcllab-text-center pcllab-default-bottom-margin-medium',
        text: trial.title
      });
    }

    // instructions
    var instructionsView = $('<h4>', {
      class: 'pcllab-default-bottom-margin-medium pcllab-text-center',
    }).html(trial.instructions);

    // containers
    var instructionsResponseWordBankContainer = $('<div>', {
      class: 'pcllab-default-bottom-margin-medium pcllab-short-answer-question-response-wordbank-container'
    });

    var instructionsResponseContainer = $('<div>', {
      class: 'pcllab-short-answer-question-response-container'
    });

    // textarea
    var responseTextAreaView = $('<textarea>', {
      class: 'form-control pcllab-default-font-larger pcllab-short-answer-response-area',
      rows: 2,
      placeholder: 'Please enter each word and press enter.'
    });

    // word bank
    var wordBankView = $('<div>', {
      class: 'pcllab-short-answer-bank-word-container',
      style: 'min-height: 100px;'
    });


    var continueBtnView = $('<button>', {
      class: 'btn btn-primary btn-lg pcllab-button-center',
      text: 'Next'
    });


    // building the view
    display_element.html('');
    if (titleView) {
      display_element.append(titleView);
    }
    instructionsResponseContainer.append(instructionsView);
    instructionsResponseContainer.append(responseTextAreaView);
    instructionsResponseWordBankContainer.append(instructionsResponseContainer);
    instructionsResponseWordBankContainer.append(wordBankView);

    display_element.append(instructionsResponseWordBankContainer);
    display_element.append(continueBtnView);

    responseTextAreaView.keyup(onKeyup);
    responseTextAreaView.keypress(onKeypress);
    continueBtnView.click(finishTrial);

    function finishTrial() {
      display_element.html('');
      jsPsych.finishTrial({
        time: Date.now() - startTime,
        words: words,
        firstKeyTimes: firstKeyTimes
      });
    }

    function onKeyup(e) {
      if (e.which == 13) {
        var word = responseTextAreaView.val().trim();
        responseTextAreaView.val('');

        if (word.length == 0) return;

  			if (words.indexOf(word) < 0) {
  		 		words.push(word);
          firstKeyTimes.push(firstKeyTime);
          firstKeyTime = -1;
          updateWordBank();
        }
      }
    }

    function onKeypress(e) {
      if (String.fromCharCode(e.which).match(/[^a-zA-Z\b]/)){
  			e.preventDefault();
  		} else if (firstKeyTime == -1) {
				firstKeyTime = (Math.round(((Date.now() - startTime))));
			}
    }

    function onClick(e) {
      var word = $(e.delegateTarget).text();
      var index = words.indexOf(word);
      words.splice(index, 1);
      firstKeyTimes.splice(index, 1);
      updateWordBank();
    }

    function updateWordBank() {
      wordBankView.html('');
      for (var i = 0; i < words.length; i++) {
        var ulElem = $('<ul>');
        wordBankView.append(ulElem);
        ulElem.append($('<li>').append($('<span>', {
          class: 'pcllab-free-recall-list-word',
          text: words[i],
          click: onClick
        })));
      }
    }
	};

	return plugin;
})();
