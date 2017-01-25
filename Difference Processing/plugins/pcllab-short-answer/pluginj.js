/**
 * @name Short Answer
 *
 * @param {bool} [show_progress=true] - If it is true, the plugin will show a progressbar for the duration of minimum_time.
 * @param {string} [url=short-answer-questions.json] - Path to the file containing the json of all short answer questions,
 * the root should be an object containing arrays of objects each have a question and type property. For a sample see
 * https://github.com/PCLLAB/Framework/blob/master/tests/short-answer-questions.json
 * @param {number} [minimum_time=1000*20] - How long to wait to show the advance button (in milliseconds).
 * @param {string} [label] - The label of the question set in the json file that the plugin should use.
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
        trial.minimum_time = trial.minimum_time || 1000 * 60;
        trial.url = trial.url || "short-answer-questions.json";
        trial.show_progress = (trial.show_progress == undefined ? true : trial.show_progress);

        trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

        var index = 0;
        var questions;

        if (!jsPsych.userInfo) {
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
           

            display_element.append("<h4>" + question.question + "</h4><br><br>");

            display_element.append('<textarea id="response_area" class="form-control" placeholder="Please type here." rows="2" style="font-size: larger;"></textarea>');
            display_element.append("<br>");
            display_element.append("<br>");

            var visibility = (trial.show_progress ? 'visible' : 'hidden');

            display_element.append('<div class="progress" style="margin-top: 15px; height: 26px; visibility:' + visibility + ' ;">' +
                '<div class="progress-bar" role="progressbar" ' +
                'aria-valuemin="0" aria-valuenow="100" aria-valuemax="100" style="width: 100%;">' +
                '</div>');
            display_element.append('<button class="btn btn-primary btn-lg pcllab-button-center" style="display: none">Continue</button>')
            $(".btn").click(function () {

                var data = {};

                data["short_answer_time"] = (new Date()).getTime() - startTime;
                data["short_answer_label"] = trial.label;
                data["short_answer_response"] = $("#response_area").val();
                data["short_answer_question"] = question.question;


                index++;

                if (index == questions.length) {
                    display_element.html("");
                    jsPsych.finishTrial(data);
                } else {
                    showQuestion(questions[index]);
                }
            });

            var timeSpent = trial.minimum_time;
            var timerInterval = setInterval(function () {
                timeSpent -= 100;
                if (timeSpent <= 0) {
                    clearInterval(timerInterval);
                    $(".progress").css('display', 'none');
                    $(".btn").css('display', 'block');
                    return;
                }

                var newValue = Math.round((timeSpent / trial.minimum_time) * 100);
                $("div.progress-bar").css('width', newValue + '%');
                $("div.progress-bar").prop('aria-valuenow', newValue);
            }, 100);
        }
    };


    return plugin;
})();
