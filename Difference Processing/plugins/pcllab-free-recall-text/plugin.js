/**
 * @name Free Recall Text
 *
 * @param {bool} [is_prompted=false] - If it is false, the plugin ignores the url and label parameters.
 * @param {string} [url=recall-questions.json] - Path to the file containing the json of all recall questions, the root
 * should be an object containing arrays of questions. For a sample see
 * https://github.com/PCLLAB/Framework/blob/master/tests/recall-questions.json
 * @param {number} [minimum_time=1000*60] - How long to wait to show the advance button (in milliseconds).
 * @param {string} [label] - The label of the question set in the json file that the plugin should use.
 * @param {string} [title=Recall] - The title to show above the questions and input area.
 *
 * @desc Put all the recall questions required by your experiment in the a json file and reference it by the url and label.
 *
 * @data {"recall_time":45002, "recall_label":"lightening", "recall_response":"hello"}
 *
 * @author Mehran Einakchi https://github.com/LOG67
 */

jsPsych.plugins["pcllab-free-recall-text"] = (function () {

    var plugin = {};

    plugin.trial = function (display_element, trial) {

        // set default values for parameters
        trial.minimum_time = trial.minimum_time || 1000 * 60;
        trial.title = trial.title || "Recall";

        trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

        if (trial.is_prompted) {
            trial.url = trial.url || "recall-questions.json";
            if (!jsPsych.userInfo) {
                jsPsych.userInfo = {};
            }

            if (!jsPsych.userInfo.recallQuestions) {
                $.getJSON(trial.url, function (data) {
                    jsPsych.userInfo.recallQuestions = data;
                    show();
                });
            } else {
                show();
            }
        } else {
            show();
        }

        function show() {
            var startTime = (new Date()).getTime();

            display_element.append("<h2 style='text-align: center;'>" + trial.title + "</h2><br><br>");

            var textAreaRows;

            if (trial.is_prompted) {
                textAreaRows = 10;

                var questions = jsPsych.userInfo.recallQuestions[trial.label];

                var olHtml = "<ol style='font-size: larger;'>";
                for (var i = 0; i < questions.length; i++) {
                    olHtml += '<li>' + questions[i] + '</li>';
                }
                olHtml += "</ol>";
                display_element.append(olHtml);
                display_element.append("<br>");

            } else {
                textAreaRows = 15;
            }

            display_element.append('<textarea id="response_area" class="form-control" placeholder="Please type here." rows="' + textAreaRows + '" style="font-size: larger;"></textarea>');
            display_element.append("<br>");
            display_element.append("<br>");

            display_element.append('<div class="progress" style="margin-top: 15px; height: 26px;">' +
                '<div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuenow="100" aria-valuemax="100" style="width: 100%">' +
                '</div>');
            display_element.append('<button class="btn btn-primary btn-lg pcllab-button-center" style="display: none">Continue</button>')
            $(".btn").click(function () {
                var data = {};

                data["recall_time"] = (new Date()).getTime() - startTime;
                data["recall_label"] = trial.label;
                data["recall_response"] = $("#response_area").val();

                display_element.html("");
                jsPsych.finishTrial(data);
            });

            var timeLeft = trial.minimum_time;
            var timerInterval = setInterval(function () {
                timeLeft -= 100;
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    $(".progress").css('display', 'none');
                    $(".btn").css('display', 'block');
                    return;
                }

                var newValue = Math.round(((timeLeft-100) / trial.minimum_time) * 100);
                $("div.progress-bar").css('width', newValue + '%');
                $("div.progress-bar").prop('aria-valuenow', newValue);
            }, 100);


        }
    };


    return plugin;
})();
