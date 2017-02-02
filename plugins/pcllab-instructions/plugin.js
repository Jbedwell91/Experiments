/**
 * @name Instructions
 *
 * @param {string} [url=instructions.json] - The address of the json file containing all instructions.
 * @param {string} [label] - You should provide the label for one instruction or an array of instructions.
 *
 * @desc This plugin assumes that there is an instructions.json file in the same directory as your experiment file
 * or you need to provide the url to a json file containing all the instructions for the experiment. The structure of
 * the json file is that the root node is an object. Each instruction set has a key and the value is either an object
 * with 'title' and 'text' properties or an array of these objects. As a sample refer to:
 * https://github.com/PCLLAB/Framework/blob/master/tests/instructions.json
 *
 * @author Mehran Einakchi https://github.com/LOG67
 */

jsPsych.plugins["pcllab-instructions"] = (function () {

    var plugin = {};

    plugin.trial = function (display_element, trial) {

        // set default values for parameters
        trial.url = trial.url || "instructions.json";

        trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

        if (!jsPsych.userInfo) {
            jsPsych.userInfo = {};
        }

        if (!jsPsych.userInfo.instructions) {
            $.getJSON(trial.url, function (data) {
                jsPsych.userInfo.instructions = data;
                show();
            });
        } else {
            show();
        }


        function show() {
            var instructions = jsPsych.userInfo.instructions[trial.label];

            if (!$.isArray(instructions)) {
                instructions = [instructions];
            }

            var index = 0;

            showNext();

            function showNext() {
                display_element.html('<h2>' + instructions[index].title + '</h2><br>');
                display_element.append(instructions[index].text + '<br><br>');
                display_element.append('<button id="continue_button" class="btn btn-primary btn-lg pcllab-button-center">Continue</button>');
                index++;
                $('#continue_button').click(function () {
                    if (index != instructions.length) {
                        showNext();
                    } else {
                        display_element.html("");
                        jsPsych.finishTrial();
                    }
                });
            }
        }
    };

    return plugin;
})();
