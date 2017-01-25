/**
 * @name Short Answer Text
 *
 * @param {string=} title - This title will appear above the plugin.
 * @param {string=Continue} button_text - Text that will appear on the 'continue' button.
 * @param {string} text_title - Title displayed above the text.
 * @param {string} text - Text stimulus that is displayed.
 * @param {string|string[]} question - Title displayed above the answer box.
 * @param {string=} text_questions_file - File location for json file containing text and questions.
 * @param {string=} stimulus_file - File name of a JSON file containing stimulus in an array.
 * @param {number=} minimum_time - Minimum amount of milliseconds allowed for the user to continue.
 * @param {number=} maximum_time - Maximum amount of milliseconds allowed for the user to continue.
 * @param {string=} output - The answers given are stored in the variable provided here.
 * @param {string=} vertically_aligned - If set to true, then the text will appear above the question.
 *
 * @author Garrick Buckley
 */

jsPsych.plugins["pcllab-short-answer-text"] = (function () {

    var plugin = {};
    var textboxScroll = 0;

    plugin.trial = function (display_element, trial) {
        var data = [];
        var startTime = (new Date()).getTime();
        var firstInteractionTime;

        trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

        // Default trial parameters
        trial.title = trial.title || "";
        trial.button_text = trial.button_text || "Continue";

        // Load instructions from params
        var stimulusFromFile = !!trial.text_questions_file;
        var questionArr;
        var stimulusIndex = 0;
        var timerInterval;

        if (stimulusFromFile) { // load instructions from JSON file
            $.getJSON(trial.text_questions_file, function (data) {
                questionArr = data.questions;
                trial.text = data.text;

                loadQuestion();
            });
        } else {
            if (typeof trial.text === "string") {
                textArr = [trial.text];

                if(typeof trial.question === "string") {
                    questionArr = [trial.question];
                } else {
                    questionArr = trial.question;
                }
            }

            loadQuestion();
        }

        function loadQuestion() {
            var currQuestion = questionArr[stimulusIndex];

            var template = $('<div>', {
                class: "pcllab-sat"
            });

            // Stimulus.
            var stimulus = $('<div>', {
                class: 'pcllab-sat-container ' +  (trial.vertically_aligned === true ? "pcllab-sat-vert" : "")
            });

            // Text
            var text = $('<div>', {
                class: 'pcllab-sat-text'
            });

            text.append("<h3>"+ trial.text_title +"</h3>");
            text.append("<div class='pcllab-sat-textbox'>"+ trial.text +"</div>");

            //Question
            var question = $('<div>', {
                class: 'pcllab-sat-question'
            });

            question.append("<h3>"+ currQuestion +"</h3>");
            question.append("<textarea>", {
                type: "text"
            });

            stimulus.append(text);
            stimulus.append(question);

            // Button
            var buttonContainer = $('<div>', {
                class: "pcllab-button-container"
            });

            var button = $('<button>', {
                                id: "continue-button",
                                class: "btn btn-primary btn-lg",
                                text: trial.button_text
                            });

            buttonContainer.append(button.on('click', function() {
                nextQuestion();
            }));

            // Progress Bar
            var progressBarContainer = $('<div>', {
                class: 'progress pcllab-default-progress'
            });

            var progressBar = $('<div>', {
                class: 'progress-bar pcllab-default-progressbar',
                role: 'progressbar',
                'aria-valuemin': 0,
                'aria-valuemax': 100,
                'aria-valuenow': 100
            });

            progressBarContainer.append(progressBar);

            if(trial.minimum_time) {
                button.prop('disabled', true);

                if (!trial.maximum_time) {
                    button.hide(); // Just hide the button, since we are automatically progressing.
                }
            }

            var timeLeft = (trial.maximum_time || trial.minimum_time);
            timerInterval = setInterval(function() {
                timeLeft -= 100;

                if (timeLeft <= 0) {
                    if (!trial.maximum_time) {
                        clearInterval(timerInterval);
                        $("#continue-button").prop('disabled', false);
                    }

                    nextQuestion();
                    return;
                }

                // Enable the continue button if we are past the min time.
                if (trial.maximum_time && timeLeft <= (trial.maximum_time - trial.minimum_time)) {
                    $("#continue-button").prop('disabled', false);
                }

                var newValue = (timeLeft / (trial.maximum_time || trial.minimum_time)) * 100;
                progressBar.css('width', newValue + '%');
                progressBar.prop('aria-valuenow', newValue);
            }, 100);

            if (trial.maximum_time || trial.minimum_time) {
                template.append(progressBarContainer);
            }
            template.append("<h1 style='text-align: center; padding-bottom: 12px;'>" + trial.title + "</h1>");
            template.append(stimulus);
            template.append(buttonContainer);

            display_element.append(template);

            // Set the scrollbar to the previous position.
            $(".pcllab-sat-textbox").scrollTop(textboxScroll);
            $(".pcllab-sat-question textarea").keydown(onInput).focus();
        }

        function onInput() {
            if (!firstInteractionTime) {
                firstInteractionTime = (new Date()).getTime() - startTime;
            }
        }

        function nextQuestion() {
            // Save the scroll position on the text.
            textboxScroll = $('.pcllab-sat-textbox').scrollTop();

            clearInterval(timerInterval);
            writeData();
            stimulusIndex++;
            display_element.html('');

            if (stimulusIndex >= questionArr.length) {
                end_trial();
            } else {
                startTime = (new Date()).getTime();
                firstInteractionTime = null;

                loadQuestion();
            }
        }

        function writeData() {
            var questionData = {};

            questionData.question = questionArr[stimulusIndex];
            questionData.answer = $('.pcllab-sat-question textarea').val();
            questionData.total_time = (new Date()).getTime() - startTime;
            questionData.first_interaction_time = firstInteractionTime || -1;

            data.push(questionData);
            if (questionArr.length !== 1) jsPsych.data.write(questionData);
        }

        function end_trial() {
            if (trial.output) {
                window[trial.output] = data;
            }

            if (questionArr.length === 1) {
                jsPsych.finishTrial(data[0]);
            } else {
                jsPsych.finishTrial();
            }
        }
    };

    return plugin;
})();