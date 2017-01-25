/**
 * @name Short Answer
 *
 * @param {string} [title=""] - Sets the title of all questions
 *
 * @param {boolean} [show_answer=false] - If it is true, the plugin will show the correct answer after each question.
 * @param {boolean} [show_word_bank=false] - If it is true and the data file has a word bank, the plugin will show a draggable word bank.
 * @param {boolean} [show_progress=true] - If it is true, the plugin will show a progressbar for the duration of minimum_time.
 * @param {boolean} [show_I_dont_know=false] - If set to true, will also show a button labeled "I don't know". The visibility of this
 * button follows the visibility of the Continue button. If the user clicks on it, the "short_answer_response" will be set to
 * the string
 * @param {string} [url=short-answer-questions.json] - Path to the file containing the json of all short answer questions,
 * the root should be an object containing arrays of objects each have a question and type property. For a sample see
 * https://github.com/PCLLAB/jsPsych-Plugins/blob/master/pcllab-short-answer/example/short-answer-questions.json
 * @param {number} [minimum_time=1000*20] - How long to wait to show the advance button (in milliseconds).
 * @param {string} label - The label of the question set in the json file that the plugin should use.
 *
 * @desc Put all the short answer questions required by your experiment in the a json file and reference it by the url and label.
 *
 * @data Notice that this plugin will add one of these data entries per question
 * {"short_answer_time":45002, "short_answer_label":"lightening", "short_answer_question":"what is a lightening?",
 *  "short_answer_response":"I don't know"}
 *
 * @author Mehran Einakchi https://github.com/LOG67
 */

jsPsych.plugins["pcllab-short-answer"] = (function () {

    var plugin = {};

    plugin.trial = function (display_element, trial) {

        // set default values for parameters
        trial.minimum_time = (trial.minimum_time === 0 ? 0 : trial.minimum_time || 1000 * 20);
        trial.url = trial.url || "short-answer-questions.json";
        trial.show_progress = (trial.show_progress === undefined ? true : trial.show_progress);
        trial.title = trial.title || "";

        trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

        var index = 0;
        var questions = null;

        if (jsPsych.userInfo === undefined) {
            jsPsych.userInfo = {};
        }

        if (!jsPsych.userInfo.shortAnswerQuestions) {
            $.getJSON(trial.url, function (data) {
                jsPsych.userInfo.shortAnswerQuestions = data;
                show();
            });
        } else {
            show();
        }


        function show() {
            questions = jsPsych.userInfo.shortAnswerQuestions[trial.label];
            showQuestion(questions[index]);
        }


        function showQuestion(question) {
            var startTime = (new Date()).getTime();

            var hasWordBank = question.word_bank && trial.show_word_bank;

            display_element.html('');

            // title
            var titleView = $('<h2>', {
              class: 'pcllab-text-center pcllab-default-bottom-margin-medium',
              text: trial.title
            });

            // question
            var questionTitleView = $('<h4>', {
              class: 'pcllab-default-bottom-margin-medium pcllab-text-center',
            }).html(question.question);

            var questionResponseWordBankContainer = $('<div>', {
              class: 'pcllab-default-bottom-margin-medium pcllab-short-answer-question-response-wordbank-container'
            });

            var quesitonResponseContainer = $('<div>', {
              class: hasWordBank ? 'pcllab-short-answer-question-response-container' : ''
            });

            // response

            var responseTextAreaView = $('<textarea>', {
              class: 'form-control pcllab-default-font-larger pcllab-short-answer-response-area',
              rows: 2,
              placeholder: 'Please type here' + (hasWordBank ? ' or drag a word from the word bank.' : '.')
            });

            quesitonResponseContainer.append(questionTitleView);
            quesitonResponseContainer.append(responseTextAreaView);

            questionResponseWordBankContainer.append(quesitonResponseContainer);

            // word bank
            var wordBankView = $('<div>', {
              class: 'pcllab-short-answer-bank-word-container'
            });
            if (hasWordBank) {
              for (var i = 0; i < question.word_bank.length; i++) {
                var ulElem = $('<ul>');
                wordBankView.append(ulElem);
                ulElem.append($('<li>').append($('<span>', {
                  class: 'draggable-word',
                  text: question.word_bank[i]
                })));
              }
              questionResponseWordBankContainer.append(wordBankView);

            }

            // progressbar
            var progressPartialView = $('<div>', {
              class: 'progress pcllab-default-progress'
            });
            var progressbarPartialView = $('<div>', {
              class: 'progress-bar pcllab-default-progressbar',
              role: 'progressbar',
              'aria-valuemin': 0,
              'aria-valuemax': 100,
              'aria-valuenow': 100
            });

            progressPartialView.append(progressbarPartialView);

            if (!trial.show_progress) {
              progressPartialView.hide();
            }

            // buttons
            var buttonsPartialView = $('<div>', {
              id: 'pcllab_short_answer_buttons_div',
              class: 'pcllab-container-center pcllab-invisible',
            });

            var continueBtnPartialView = $('<button>', {
              class: 'btn btn-primary btn-lg pcllab-short-answer-continue-btn',
              text: 'Next'
            });

            var dontKnowBtnPartialView = $('<button>', {
              id: 'pcllab_short_answer_dont_know_btn',
              class: 'btn btn-info btn-lg',
              text: 'I don\'t know'
            });

            buttonsPartialView.append(continueBtnPartialView);
            if (trial.show_I_dont_know) {
              buttonsPartialView.append(dontKnowBtnPartialView);
            }

            continueBtnPartialView.click(advanceToNextQuestion);
            dontKnowBtnPartialView.click(function () {
              responseTextAreaView.val("I don't know");
              // advanceToNextQuestion();
            });

            // building the view
            display_element.append(titleView);
            display_element.append(questionResponseWordBankContainer);
            if (trial.minimum_time) {
              display_element.append(progressPartialView);
            }
            display_element.append(buttonsPartialView);

            // draggable stuff
            $('.draggable-word').draggable({
              helper: "clone",
              revert: "invalid",
              cursor: "move",
              start: function (event, ui) {
                ui.helper.addClass('pcllab-short-answer-bank-word-selected');
              },
              stop: function (event, ui) {
                ui.helper.removeClass('pcllab-short-answer-bank-word-selected');
              }
            });

            responseTextAreaView.droppable({
              drop: function (event, ui) {
                responseTextAreaView.val(ui.draggable.text());
              }
            });

            // timer
            var timeLeft = trial.minimum_time;
            var timerInterval = setInterval(function () {
                timeLeft -= 100;

                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    progressPartialView.hide();
                    buttonsPartialView.removeClass('pcllab-invisible');
                    return;
                }

                var newValue = Math.round((timeLeft / trial.minimum_time) * 100);
                console.log(newValue);
                progressbarPartialView.css('width', newValue + '%');
                progressbarPartialView.prop('aria-valuenow', newValue);
            }, 100);


            function advanceToNextQuestion() {
              writeData();

              if (trial.show_answer && questions[index].answer) {
                showAnswer(questions[index]);
              } else {
                displayNextQuestion();
              }
            }

            function displayNextQuestion() {
              // go to the next question
              index++;
              // end of questions
              if (index == questions.length) {
                  display_element.html('');
                  // since we are write to data we don't need to use this to get the data back
                  jsPsych.finishTrial('');
              } else {
                  showQuestion(questions[index]);
              }
            }

            function showAnswer(question) {

              var answerView = $('<h4>', {
                class: 'pcllab-text-center pcllab-default-bottom-margin-medium',
                text: 'The correct answer is ' + question.answer
              })

              var continueBtn = $('<button>', {
                class: 'btn btn-primary btn-lg pcllab-button-center',
                text: 'Next'
              });

              continueBtn.click(displayNextQuestion);

              display_element.html('');
              display_element.append(titleView);
              if (question.filled_question) {
                var filledQuestionView = $('<h4>', {
                  class: 'pcllab-default-bottom-margin-medium pcllab-text-center',
                }).html(question.filled_question);
                display_element.append(filledQuestionView);
              } else {
                display_element.append(questionTitleView);
              }
              display_element.append(answerView);
              display_element.append(
                responseTextAreaView.addClass('pcllab-default-bottom-margin-medium').attr('placeholder', '').attr('readonly', true));
              display_element.append(continueBtn);
            }

            function writeData() {
              var data = {};

              data.short_answer_time = (new Date()).getTime() - startTime;
              data.short_answer_label = trial.label;
              data.short_answer_response = responseTextAreaView.val();
              data.short_answer_question = question.question;

              jsPsych.data.write(data);
            }
        }
    };


    return plugin;
})();
