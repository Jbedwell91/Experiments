/**
 * @name Order Reconstruction
 *
 * @param {string?} title - Title to display above the experiment.
 * @param {string[]} ordered_list - List of strings in the order of which they were presented.
 * @param {string?} ordered_list_file - JSON file containing the list of items.
 *
 * @author Garrick Buckley
 */

jsPsych.plugins["pcllab-order-reconstruction"] = (function () {

  var plugin = {};

  plugin.trial = function (display_element, trial) {
    var startTime = (new Date()).getTime();
    var firstInteractionTime;
    var history = [];

    trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

    // Load instructions from params
    var itemsFromFile = !!trial.ordered_list_file;
    var items_arr;

    if (itemsFromFile) { // load instructions from JSON file
      $.getJSON(trial.ordered_list_file, function (data) {
        items_arr = data;
        setup();
      });
    } else {
        items_arr = trial.ordered_list;
        setup();
    }

    var reorderedList;

    function setup() {
      // Shuffle the array.
      reorderedList = shuffle(items_arr);

      /* The column where the items will be randomly displayed. */
      var givenColumn = $('<div>', {
        class: "reconstruction-column"
      });

      var givenColumnList = $('<ul>', {
        class: "reconstruction-given-values",
      });

      reorderedList.forEach(function(item) {
        $(givenColumnList).append('<li>' + item + '</li>');
      });

      $(givenColumn).append(givenColumnList);

      /* The column where the user will place the objects in order. */
      var sortedColumn = $('<div>', {
        class: "reconstruction-column"
      });

      var sortedColumnList = $('<div>');

      for (var i = 1; i <= items_arr.length; i++) {
        var container = $('<div>', {
          class: "reconstruction-sorted-container"
        });

        $(container).append($('<p>' + i + ':</p>'));

        $(container).append($('<ul>', {
          class: 'reconstruction-sorted-value-container'
        }));

        $(sortedColumnList).append(container);
      }

      $(sortedColumn).append(sortedColumnList);

      var reconstructionColumnContainer = $('<div>', {
        class: "reconstruction-column-container",
      });

      // Button
      button = $('<div>', {
        class: "pcllab-button-container"
      });

      button.append($('<button>', {
        class: "btn btn-primary",
        text: "Submit",
        disabled: true
      }).on('click', function() {
        end_trial();
      }));

      /* Construct the DOM. */
      reconstructionColumnContainer.append(givenColumn);
      reconstructionColumnContainer.append($("<span>", { class: "reconstruction-divider" }));
      reconstructionColumnContainer.append(sortedColumn);
      display_element.append($('<h3 style="text-align: center; padding-bottom: 15px;">' + (trial.title || "") + '</h3>'));
      display_element.append(reconstructionColumnContainer);
      display_element.append(button);

      var tempLoc;

      /* Make the items sortable. */
      $(".reconstruction-given-values").sortable({
        connectWith: "ul",
        receive: function() {
          $(".pcllab-button-container > button").attr("disabled", true)
        },
        remove: function(event, ui) {
          if (typeof firstInteractionTime === "undefined") {
            firstInteractionTime = (new Date()).getTime() - startTime;
          }

          if ($(this).children().length === 0) {
            $(".pcllab-button-container > button").attr("disabled", false)
          } else {
            $(".pcllab-button-container > button").attr("disabled", true)
          }

          // Store temporary info about an item in the left row when it's being swapped with the right row
          var parent = $(ui.item).parent();
          if ($(parent).hasClass("reconstruction-sorted-value-container")
            && $(parent).children().length > 1) {
            tempLoc = ui.item.parent();
          }
        }
      }).disableSelection();

      $(".reconstruction-sorted-value-container").sortable({
        connectWith: "ul",
        placerholder: "reconstruction-placeholder",
        forcePlaceholderSize: true,
        receive: function(event, ui) {
          if ($(this).children().length > 1) {
            // Swap an item in the right row...
            if ($(ui.sender).hasClass("reconstruction-sorted-value-container")) {
              // With another item in the right row
              $(ui.sender).sortable('cancel');
              var temp = ui.item.parent().html();
              $(ui.item).parent().html($(this).html());
              $(this).html(temp);
            } else {
              // With an item in the left row
              $(".pcllab-button-container > button").attr("disabled", true)
              $(ui.sender).sortable('cancel');
              $(ui.item).after($(tempLoc.children()[0]));
              tempLoc.html(ui.item);
            }
          }

          history.push(get_ordered_list());
        }
      }).disableSelection();
    }

    function shuffle(array) {
      var clone = $.merge([], array)

      var i = 0, j = 0, temp = null

      for (i = clone.length - 1; i > 0; i -= 1) {
        j = Math.floor(Math.random() * (i + 1));
        temp = clone[i];
        clone[i] = clone[j];
        clone[j] = temp;
      }

      return clone;
    }

    function get_ordered_list() {
      var orderedList = [];

      $(".reconstruction-column > div > div").each(function(index) {
        orderedList[index] = $(this).find("ul > li").html() || null;
      });

      return orderedList;
    }

    function get_distance_list(ordered_list, user_list) {
      var distance_list = [];

      for(var i = 0; i < ordered_list.length; i++) {
        distance_list.push(i - user_list.indexOf(ordered_list[i]));
      }

      return distance_list;
    }

    function end_trial() {
      var time = (new Date()).getTime() - startTime;

      var userOrderedList = get_ordered_list();

      var trial_data = {
        total_time: time,
        "first_interaction_time": firstInteractionTime || -1,
        "displayedList": reorderedList,
        "orderedList": userOrderedList,
        "history": history,
        "distanceList": get_distance_list(items_arr, userOrderedList)
      };

      display_element.html('');
      jsPsych.finishTrial(trial_data);
    };
  };

  return plugin;
})();
