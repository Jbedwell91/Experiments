/**
 * @name Distractor Game
 *
 * @param {number} [time=1000*60] - How long to show the distraction.
 * @param {string} [title=Pac Man] - The title that is shown above the game.
 * @param {string} [url=http://www.classicgamesarcade.com/games/pacman.swf] - The url to the flash file of the game.
 * Make sure that it is the actual shock-wave file which ends in swf file extension.
 *
 * @desc Shows a game for specific duration.
 *
 * @author Mehran Einakchi https://github.com/LOG67
 */

jsPsych.plugins["pcllab-distractor-game"] = (function () {

    var plugin = {};

    plugin.trial = function (display_element, trial) {

        trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

        trial.time = trial.time || 1000 * 60;
        trial.url = trial.url || "http://www.classicgamesarcade.com/games/pacman.swf";
        trial.title = trial.title || "Pac Man";


        display_element.html('<div style="text-align: center;"> ' +
            '<h2>' + trial.title + '</h2><br> ' +
            '<embed id="game_box" src="' + trial.url + '" width="100%" height="500px" autoplay="true"></embed>' +
            '</div><br>');

        display_element.append('<div class="progress" style="margin-top: 15px; height: 26px;">' +
            '<div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuenow="100" aria-valuemax="100" style="width: 100%">' +
            '</div>');
        display_element.append('<button class="btn btn-primary btn-lg pcllab-button-center" style="display: none">Continue</button>');
        $(".btn").click(function () {
            display_element.html("");
            jsPsych.finishTrial();
        });

        var timeLeft = trial.time;
        var timerInterval = setInterval(function () {
            timeLeft -= 100;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                $(".progress").css('display', 'none');
                $(".btn").css('display', 'block');
                $("#game_box").css('display', 'none');
                return;
            }

            var newValue = Math.round(((timeLeft-100) / trial.time) * 100);
            $("div.progress-bar").css('width', newValue + '%');
            $("div.progress-bar").prop('aria-valuenow', newValue);
        }, 100);
    };

    return plugin;
})();
