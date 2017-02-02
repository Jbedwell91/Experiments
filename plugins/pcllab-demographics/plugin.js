/**
 * @name Demographics
 *
 * @desc Provides text input for age and gender, and radio button for whether english is the experimentee's first language. It
 * also checks that the age is a number between 0 and 125, there is a value for gender and the English question is answered.
 *
 * @data {"demo_age":25, "demo_gender":"female", "demo_english":"yes"}
 *
 * @author Mehran Einakchi https://github.com/LOG67
 */

jsPsych.plugins["pcllab-demographics"] = (function () {

    var plugin = {};

    plugin.trial = function (display_element, trial) {

        trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

        display_element.html('<h2>Demographics Information</h2><br>');

        display_element.append('<h4>What is your age?</h4><br>' +
            '<input id="age_demo" type="number" class="form-control" placeholder="e.g. 25"><br>');


        display_element.append('<h4>What is your gender?</h4><br>' +
            '<input id="gender_demo" type="text" class="form-control" placeholder="e.g. female"><br>');

        display_element.append('<h4>Is English your first language?</h4><br>');
        display_element.append('<div style="font-size: larger;">' +
            '<label class="radio-inline"><input type="radio" name="english_demo" value="yes">&nbsp;Yes</label>&nbsp;&nbsp;&nbsp;' +
            '<label class="radio-inline"><input type="radio" name="english_demo" value="no">&nbsp;No</label></div><br><br>');

        display_element.append('<button id="continue_btn" class="btn btn-primary btn-lg pcllab-button-center">Continue</button>');

        $("#continue_btn").click(function () {
            var data = {};

            var age = $('input[id=age_demo]').val();
            age = parseInt(age);
            if (isNaN(age) || age < 0 || age > 125) {
                alert("Please provide a reasonable number for your age!");
                return;
            }
            data['demo_age'] = age;


            var gender = $('input[id=gender_demo]').val();
            if (!gender || !gender.trim()) {
                alert("Please provide your gender!");
                return;
            }
            data['demo_gender'] = gender;


            if (!$("input:radio[name=english_demo]").is(":checked")) {
                alert("Please specify whether English is your first language!");
                return;
            }
            data['demo_english'] = $('input:radio:checked[name=english_demo]').val();
            ;

            display_element.html("");
            jsPsych.finishTrial(data);
        });

    };

    return plugin;
})();
