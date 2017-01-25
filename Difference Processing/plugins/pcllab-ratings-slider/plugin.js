/**
 * @name Ratings Slider
 *
 * @param {string} title - This title will appear above the instructions.
 * @param {string | string[]} instructions - The text prompt that is displayed above the ratings slider.
 * @param {string} instructions_file - File name of a JSON file containing instructions in an array.
 * @param {string} [label_left=Strongly Disagree] - Label that is displayed on the left side of the ratings slider.
 * @param {string} [label_right=Strongly Agree] - Label that is displayed on the right side of the ratings slider.
 * @param {string} [button_text=Next] - The label of the question set in the json file that the plugin should use.
 * @param {number} [slider_value=50] - The value at which the slider is set to by default.
 * @param {number} [slider_step=1] - The amount of numbers between each 'step' of the slider.
 * @param {boolean} [display_value=false] - Display the currently selected value?
 * @param {boolean} [hot_and_cold_slider=false - Display the slider with blue on the left side and red on the right side.
 * @param {string=} output - The answers given are stored in the variable provided here.
 *
 * @author Garrick Buckley
 */

jsPsych.plugins["pcllab-ratings-slider"] = (function () {

  var plugin = {};

  plugin.trial = function (display_element, trial) {
    var data = [];
    var startTime = (new Date()).getTime();
    var firstInteractionTime;

    // default trial parameters
    trial.title = trial.title || "";
    trial.label_left = trial.label_left || "Strongly Disagree";
    trial.label_right = trial.label_right || "Strongly Agree";
    trial.button_text = trial.button_text || "Next";

    // Load instructions from params
    var instructionsFromFile = !!trial.instructions_file;
    var instructions_arr;
    var questionIndex = 0;

    if (instructionsFromFile) { // load instructions from JSON file
      $.getJSON(trial.instructions_file, function (data) {
        instructions_arr = data;

        loadQuestion();
      });
    } else {
      if(typeof trial.instructions === "string") {  // load instructions as string
        instructions_arr = [trial.instructions];
      } else if(Array.isArray(trial.instructions)) {  // load instructions as array
        instructions_arr = trial.instructions;
      }

      loadQuestion();
    }

    trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

    function loadQuestion() {
      var instruction = instructions_arr[questionIndex];

      ratingsSlider = $('<div>', {
        class: "pcllab-ratings-slider"
      });

      // Instructions
      instructions = $('<div>', {
        class: "pcllab-ratings-slider-instructions"
      });

      instructions.append($('<p>' + instruction + '</p>'));

      var slider;

      // Slider
      if (trial.hot_and_cold_slider) {
        slider = $('<div>', {
          class: "pcllab-ratings-slider-slider pcllab-ratings-school-slider"
        });
      } else {
        slider = $('<div>', {
          class: "pcllab-ratings-slider-slider"
        });
      }

      slider.append($('<div>' + trial.label_left + '</div>'));

      slider.append($('<input>', {
        type: "range",
        value: trial.slider_value,
        step: trial.slider_step,
      }));

      slider.append($('<div>' + trial.label_right + '</div>'));

      slider.on('change', function() {
        if (!firstInteractionTime) {
          firstInteractionTime = (new Date()).getTime() - startTime;
        }
      });

      // Button
      button = $('<div>', {
        class: "pcllab-button-container"
      });

      button.append($('<button>', {
        class: "btn btn-primary btn-lg pcllab-ratings-button",
        text: trial.button_text
      }).on('click', function() {
        nextQuestion();
      }));

      ratingsSlider.append("<h1 style='text-align: center; padding-bottom: 12px;'>" + trial.title + "</h1>");
      ratingsSlider.append(instructions);
      ratingsSlider.append(slider);

      if (trial.display_value) {
        sliderValue = $('<div>', {
          class: "pcllab-slider-value"
        });

        $(slider).change(function() {
          $('.pcllab-slider-value').html(($(this).find('input').val()));
        });

        sliderValue.html(trial.slider_value || 50);

        ratingsSlider.append(sliderValue);
      }

      ratingsSlider.append(button);

      display_element.append(ratingsSlider);
    }

    function nextQuestion() {
      writeData();
      questionIndex++;
      display_element.html('');

      if (questionIndex >= instructions_arr.length) {
        end_trial();
      } else {
        startTime = (new Date()).getTime();
        firstInteractionTime = null;

        loadQuestion();
      }
    }

    function writeData() {
      var sliderData = {};

      sliderData.instruction = instructions_arr[questionIndex];
      sliderData.total_time = (new Date()).getTime() - startTime;
      sliderData.first_interaction_time = firstInteractionTime || -1;
      sliderData.value = $(".pcllab-ratings-slider-slider > input").val() || -1;

      data.push(sliderData);
      if (instructions_arr.length !== 1) jsPsych.data.write(sliderData);
    }

    function end_trial() {
      if (trial.output) {
        window[trial.output] = data;
      }

      if (instructions_arr.length === 1) {
        jsPsych.finishTrial(data[0]);
      } else {
        jsPsych.finishTrial();
      }
    }
  };

  return plugin;
})();
