/**
 * @name Stop Sign
 *
 * @param {string} [title] - The title / instructions for this page
 * @param {string} [minimum_time=0] - minimum time to wait before displaying next button
 *
 * @author Matt Molo
 */

jsPsych.plugins["pcllab-stop-sign"] = (function () {

  var plugin = {};

  plugin.trial = function (display_element, trial) {

    trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);
    trial.title = trial.title || "";
    trial.minimum_time = trial.minimum_time || 0;

    display_element.load("plugins/pcllab-stop-sign/template.html", function() {
        $('.pcllab-stop-sign-title').html(trial.title);

        // Unhide the button and add on click to finish trial.
        setTimeout(function() {
            $('.pcllab-stop-sign-hidden-btn').css('display', 'block');
            $('.pcllab-stop-sign-hidden-btn').click(function() {
              display_element.html('');
              jsPsych.finishTrial();
            });
        }, trial.minimum_time);
    });
  };

  return plugin;
})();
