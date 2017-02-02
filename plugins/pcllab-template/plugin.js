/**
 * @name <Plugin Name>
 *
 * @param {string} title - This title will appear above the plugin.
 * @param {string=Continue} button_text - Text that will appear on the 'continue' button.
 * @param {string|string[]} stimulus - Text stimulus that is displayed.
 * @param {string=} stimulus_file - File name of a JSON file containing stimulus in an array.
 * @param {number} minimum_time - Minimum amount of milliseconds allowed for the user to continue.
 * @param {number} maximum_time - Maximum amount of milliseconds allowed for the user to continue.
 * @param {string=} output - The answers given are stored in the variable provided here.
 *
 * @author <Your Name Here>
 */

jsPsych.plugins["pcllab-template"] = (function () {

    var plugin = {};

    plugin.trial = function (display_element, trial) {
        var startTime = (new Date()).getTime();
        var firstInteractionTime;
        var data = [];

        // Default trial parameters
        trial.title = trial.title || "";
        trial.button_text = trial.button_text || "Continue";

        // Load instructions from params
        var stimulusFromFile = !!trial.stimulus_file;
        var stimulusArr;
        var stimulusIndex = 0;
        var timerInterval;

        trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

        if (stimulusFromFile) { // load instructions from JSON file
            $.getJSON(trial.stimulus_file, function (data) {
                stimulusArr = data;

                loadQuestion();
            });
        } else {
            if(typeof trial.stimulus === "string") {  // load instructions as string
                stimulusArr = [trial.stimulus];
            } else if(Array.isArray(trial.stimulus)) {  // load instructions as array
                stimulusArr = trial.stimulus;
            }

            loadQuestion();
        }

        function loadQuestion() {
            var currStimulus = stimulusArr[stimulusIndex];

            var template = $('<div>', {
                class: "pcllab-template"
            });

            // Stimulus.
            var stimulus = $('<p>' + currStimulus + '</p>');


            /* TODO: PUT YOUR PLUGIN LOGIC HERE */


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
        }

        function nextQuestion() {
            /* Move/edit this code block to run when there's an interaction. */
            if (!firstInteractionTime) {
                firstInteractionTime = (new Date()).getTime() - startTime;
            }

            clearInterval(timerInterval);
            writeData();
            stimulusIndex++;
            display_element.html('');

            if (stimulusIndex >= stimulusArr.length) {
                end_trial();
            } else {
                startTime = (new Date()).getTime();
                firstInteractionTime = null;

                loadQuestion();
            }
        }

        function writeData() {
            var questionData = {};

            questionData.stimulus = stimulusArr[stimulusIndex];
            questionData.total_time = (new Date()).getTime() - startTime;
            questionData.first_interaction_time = firstInteractionTime || -1;

            data.push(questionData);
            if (stimulusArr.length !== 1) jsPsych.data.write(questionData);
        }

        function end_trial() {
            if (trial.output) {
                window[trial.output] = data;
            }

            if (stimulusArr.length === 1) {
                jsPsych.finishTrial(data[0]);
            } else {
                jsPsych.finishTrial();
            }
        }
    };

    return plugin;
})();