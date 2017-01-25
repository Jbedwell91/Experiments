/**
 * @name Environment Survey
 *
 * @desc Asks the experimentee to rate the noise level from 1 to 5, choose the device type, whether she cheated and
 * write a comment if she wants. This plugin checks that the experimentee has answered all questions except comment
 * which is optional.
 *
 * @data {"env_noise":"4", "env_device":"desktop", "env_cheat":"yes", "env_comment":"hello world"}
 *
 * @author Mehran Einakchi https://github.com/LOG67
 */

jsPsych.plugins["pcllab-environment-survey"] = (function () {

    var plugin = {};

    plugin.trial = function (display_element, trial) {

        trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

        display_element.html("");

        display_element.append("<h2>Please answer the following questions about your environment while you completed this session.</h2>");
        display_element.append("<br>");

        // Noise section

        display_element.append("<h4>What is the noise level of your environment?</h4>");
        display_element.append("<br>");

        display_element.append('<div style="font-size: larger;">' +
            '<label class="radio-inline"><input type="radio" name="noise" value="1">&nbsp;Very Quiet (1)</label><br>' +
            '<label class="radio-inline"><input type="radio" name="noise" value="2">&nbsp;Quiet (2)</label><br>' +
            '<label class="radio-inline"><input type="radio" name="noise" value="3">&nbsp;Neutral (3)</label><br>' +
            '<label class="radio-inline"><input type="radio" name="noise" value="4">&nbsp;Loud (4)</label><br>' +
            '<label class="radio-inline"><input type="radio" name="noise" value="5">&nbsp;Very Loud (5)</label></div>');

        display_element.append("<br>");
        display_element.append("<br>");

        // Device section

        display_element.append("<h4>What device did you use during this experiment?</h4>");
        display_element.append("<br>");

        display_element.append('<div style="font-size: larger;">' +
            '<label class="radio-inline"><input type="radio" name="device" value="laptop">&nbsp;Laptop</label><br>' +
            '<label class="radio-inline"><input type="radio" name="device" value="desktop">&nbsp;Desktop</label><br>' +
            '<label class="radio-inline"><input type="radio" name="device" value="netbook">&nbsp;Netbook</label><br>' +
            '<label class="radio-inline"><input type="radio" name="device" value="smartphone">&nbsp;Smartphone</label><br>' +
            '<label class="radio-inline"><input type="radio" name="device" value="tablet">&nbsp;Tablet/iPad</label></div>');

        display_element.append("<br>");
        display_element.append("<br>");

        // cheat section

        display_element.append("<h4>Did you cheat at all during the experiment? You will receive credit regardless of whether you cheated or not, so please answer truthfully.</h4>");
        display_element.append("<br>");

        display_element.append('<div style="font-size: larger;">' +
            '<label class="radio-inline"><input type="radio" name="cheat" value="yes">&nbsp;Yes</label>&nbsp;&nbsp;&nbsp;' +
            '<label class="radio-inline"><input type="radio" name="cheat" value="no">&nbsp;No</label></div>');

        display_element.append("<br>");
        display_element.append("<br>");

        // Comment section

        display_element.append("<h4>If you would like to provide any comments about the experiment, please enter them into the space below.</h4>");
        display_element.append("<br>");

        display_element.append('<textarea id="comment_area" class="form-control" rows="6" style="font-size: larger;"></textarea>');

        display_element.append("<br>");
        display_element.append("<br>");

        display_element.append("<button id='continue_btn' class='btn btn-primary btn-lg pcllab-button-center'>Continue</button>");

        $("#continue_btn").click(function () {
            var data = {};

            if (!$("input:radio[name=noise]").is(":checked")) {
                alert("Please specify the noise level of the environment.");
                return;
            }
            data['env_noise'] = $('input:radio:checked[name=noise]').val();

            if (!$("input:radio[name=device]").is(":checked")) {
                alert("Please specify the type of device you used for the experiment.");
                return;
            }
            data['env_device'] = $('input:radio:checked[name=device]').val();


            if (!$("input:radio[name=cheat]").is(":checked")) {
                alert("Please specify whether you have cheated.");
                return;
            }
            data['env_cheat'] = $("input:radio:checked[name=cheat]").val();

            data['env_comment'] = $("#comment_area").val();

            display_element.html("");
            jsPsych.finishTrial(data);
        });
    };

    return plugin;
})();
