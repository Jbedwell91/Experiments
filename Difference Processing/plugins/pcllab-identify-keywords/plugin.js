/**
 * @name Ratings Slider
 *
 * @param {string} text - The text to be displayed and words are picked from
 * @param {string} [title] - The title for the article text
 * @param {string} [minimum_time=0] - Minimum time to wait before displaying next button
 * @param {string} [wordbank=true] - display word bank
 * @param {array: string} [stopwords] - words to ignore when selecting
 *
 * @author Matt Molo
 */

jsPsych.plugins["pcllab-identify-keywords"] = (function () {

  var plugin = {};

  plugin.trial = function (display_element, trial) {

    trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);
    trial.minimum_time = trial.minimum_time || 0;
    trial.stopwords = trial.stopwords || ['and','a','the','it','from','like', 'of'];

    if (trial.wordbank == undefined) {
        trial.wordbank = true;
    }

    display_element.load("plugins/pcllab-identify-keywords/template.html", function() {
        setup();
    });

    var word_list = [];

    function setup() {

        var startTime = Date.now();

        if (trial.title != undefined) {
            $('.pcllab-identify-keywords-title').html(trial.title);
        }

        if (trial.wordbank == false) {
            $('.pcllab-identify-keywords-wordbank-container').hide();
            $('.pcllab-identify-keywords-text').css('width', '100%');
            $('.pcllab-identify-keywords-text').css('height', 'auto');
        }

        setTimeout(function() {
            $('button').css('display', '');
        }, trial.minimum_time);

        var timeLeft = trial.minimum_time;
        var timerInterval = setInterval(function () {
            timeLeft -= 100;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                $(".progress").css('display', 'none');
                $(".btn").css('display', 'block');
                return;
            }

            var newValue = Math.round(((timeLeft - 100) / trial.minimum_time) * 100);
            $("div.progress-bar").css('width', newValue + '%');
            $("div.progress-bar").prop('aria-valuenow', newValue);
        }, 100);

        $(".btn").click(end_trial);

        function appendWords(words) {
            var words = words.split(" ");
            var textElement = $('.pcllab-identify-keywords-text');
            words.forEach(function(word) {
                word = word.trim()
                var delimiters = [' ', ',', '.', '!', '?', ':', ';'];

                var delim = delimiters.indexOf(word[word.length-1]);
                if (delim > 0) {
                    word = word.substring(0, word.length-1);
                } else {
                    // Used to add a space when appending
                    delim = 0;
                }

                if (trial.stopwords.indexOf(word) > 0) {
                    textElement.append(word + " ");
                } else {
                    var element = '<span class="pcllab-identify-keywords-word">{{word}}</span>'.
                        replace("{{word}}", word);

                    textElement.append($(element));
                    textElement.append(delimiters[delim]);
                }
            });
        }

        if (Array.isArray(trial.text)) {
            trial.text.forEach(function(section) {
                $('.pcllab-identify-keywords-text').append(
                    "<h2>"+section[0]+"</h2>")

                appendWords(section[1]);
            })
        } else {
            var words = trial.text.split(" ");
            appendWords(trial.text);
        }

        function select() {
            var word = $(this).html().trim()
            $(this).addClass('pcllab-identify-keywords-word-selected');
            $(this).off("click");
            $(this).click(deselect);

            if (word_list.indexOf(word) < 0) {
                word_list.push(word);
                console.log(word_list);
            }
            render_wordbank();
        }

        function deselect() {
            var word = $(this).html().trim()
            $(this).removeClass('pcllab-identify-keywords-word-selected');
            $(this).off("click");
            $(this).click(select);

            var index = word_list.indexOf(word);
            if (index >= 0) {
                word_list.splice(index, 1);
                console.log(word_list);
            }
            render_wordbank();
        }

        function render_wordbank() {
            var wordbank = $('.pcllab-identify-keywords-wordbank');
            wordbank.empty()
            word_list.forEach(function(word) {
                wordbank.append("<p>"+word+"</p>")
            })

            wordbank.scrollTop(wordbank[0].scrollHeight)
        }

        $('.pcllab-identify-keywords-word').click(select);
    };


    function end_trial() {
      var trial_data = {
        "selected_words": word_list
      };

      display_element.html('');
      jsPsych.finishTrial(trial_data);
    };

  };

  return plugin;
})();
