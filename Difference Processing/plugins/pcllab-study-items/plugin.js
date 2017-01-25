/**
 * @name Study Items
 *
 * @param {array} stimuli - Each element of the array is either another array of strings or a string which is a word or a path to an image.
 * @param {number} [frame_time=250] - How long to display each item or items (in milliseconds).
 * @param {number} [blank_time=0] - If greater than 0, then a gap will be shown between each item/items in the sequence. This parameter specifies the length of the gap.

 * @author Mehran Einakchi https://github.com/LOG67
 */

jsPsych.plugins["pcllab-study-items"] = (function () {

    var plugin = {};

    jsPsych.pluginAPI.registerPreload('pcllab-study-items', 'stimuli', 'image');

    plugin.trial = function (display_element, trial) {

        // set default values for parameters
        trial.frame_time = trial.frame_time || 250;
        trial.blank_time = trial.blank_time || 0;

        trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);


        var index = -1;
        var intervalTime = trial.frame_time + trial.blank_time;
        var startTime = (new Date()).getTime();

        var containerView = $('<div>', {
            class: 'pcllab-container-center'
        });

        display_element.html('');
        display_element.append(containerView);

        var animationData = [];
        var animateInterval = null;

        animateInterval = setInterval(repeat, intervalTime);

        function repeat() {
          index++;
          if (index == trial.stimuli.length) {
              clearInterval(animateInterval);
              var trialData = {
                  "study_sequence": JSON.stringify(animationData)
              };
              display_element.html('');
              jsPsych.finishTrial(trialData);
          } else {
            showNextFrame();
          }
        }



        function showNextFrame() {
            var current = trial.stimuli[index];
            animationData.push({
                stimuli: current,
                time: (new Date()).getTime() - startTime
            });
            showEntity(current);

            if (trial.blank_time > 0) {
                setTimeout(function() {
                    containerView.hide();
                    animationData.push({
                        stimuli: "blank",
                        time: (new Date()).getTime() - startTime
                    });
                }, trial.frame_time);
            }
        }

        function showEntity(current) {
          containerView.html("");
          containerView.show();
          if (!Array.isArray(current)) {
              current = Array(current);
          }

          for (var i = 0; i < current.length; i++) {
              var item = current[i];
              if (isImage(item)) {
                  containerView.append($('<img>', {
                      class: 'pcllab-default-bottom-margin-medium',
                      src: item
                  }));
                  containerView.append($('<br>'));
              } else {
                  containerView.append($('<p>',{
                    class: 'pcllab-default-bottom-margin-medium',
                    text: item
                  }));
              }
          }
        }

        function isImage(input) {
          var comps = input.split('.');
          if (comps.length == 1) {
              return false;
          }
          var extension = comps[comps.length - 1].toLowerCase();
          if ( extension == "jpg" || extension == "png" || extension == "jpeg" || extension == "gif" ) {
              return true;
          }
          return false;
        }
    };

    return plugin;
})();
