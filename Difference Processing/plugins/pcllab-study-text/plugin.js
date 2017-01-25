/**
 * @name Study Text
 *
 * @param {string} [url=texts.json] - Path to the file containing the json of all texts used in the experiment, the root
 * should be an object containing objects with properties title and text. For a sample see
 * https://github.com/PCLLAB/Framework/blob/master/tests/texts.json
 * @param {number} [minimum_time=1000*60] - How long to wait to show the advance button (in milliseconds).
 * @param {boolean} [auto_advance] - Auto advance to the next trial when minimum_time is elapsed (Must set minimum_time time)
 * @param {string} [label] - The label of the specific text from the json file.
 *
 * @desc Put all the texts required by your experiment in the a json file and reference it by the url and index.
 *
 * @data {"study_text_time":45002, "study_text_title":"the text title", "study_text_label":"label1"}
 *
 * @author Mehran Einakchi https://github.com/LOG67
 */

jsPsych.plugins["pcllab-study-text"] = (function () {

    var plugin = {};

    plugin.trial = function (display_element, trial) {

        // set default values for parameters
        trial.minimum_time = trial.minimum_time || 1000 * 60;
        trial.url = trial.url || "texts.json";
        if (trial.auto_advance == undefined) {
            trial.auto_advance = false;
        }
        trial.showPB = trial.showPB || false;

        trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

        if (!jsPsych.userInfo) {
            jsPsych.userInfo = {};
        }

        if (!jsPsych.userInfo.texts) {
            $.getJSON(trial.url, function (data) {
                jsPsych.userInfo.texts = data;
                show();
            });
        } else {
            show();
        }

        function show() {
            var startTime = (new Date()).getTime();
            var text = jsPsych.userInfo.texts[trial.label];

            var titleView = $('<h2>', {
              class: 'pcllab-text-center pcllab-default-bottom-margin-medium',
              text: text.title
            });

            var textView = $('<div>', {
              class: 'pcllab-default-bottom-margin-medium'
            });
            textView.html(text.text);

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

            var continueBtnView = $('<button>', {
              class: 'btn btn-primary btn-lg pcllab-invisible pcllab-button-center',
              text: 'Continue'
            }).click(end_trial);

            display_element.append(titleView);
            display_element.append(textView);
            if(trial.showPB == true){
                display_element.append(progressPartialView);
            }
            display_element.append(continueBtnView);

            // timer
            var timeLeft = trial.minimum_time;
            var timerInterval = setInterval(function () {
                timeLeft -= 100;

                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    progressPartialView.hide();
                    continueBtnView.removeClass('pcllab-invisible');
                    return;
                }

                var newValue = Math.round((timeLeft / trial.minimum_time) * 100);
                console.log(newValue);
                progressbarPartialView.css('width', newValue + '%');
                progressbarPartialView.prop('aria-valuenow', newValue);
            }, 100);

            function end_trial() {
                display_element.html('');
                jsPsych.finishTrial({
                    study_text_time: (new Date()).getTime() - startTime,
                    study_text_title: text.title,
                    study_text_label: trial.label
                });
            }
        }
    };

    return plugin;
})();
