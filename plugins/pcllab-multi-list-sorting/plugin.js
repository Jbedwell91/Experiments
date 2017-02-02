/**
 * @name Multi List Sorting
 *
 * @param {string?} title - The title shown above the items.
 * @param {Object} items - Object containing arrays of strings that must be sorted in the way presented here.
 * @param {string[]?} items_file - JSON file containing the items.
 *
 * @author Garrick Buckley
 */

jsPsych.plugins["pcllab-multi-list-sorting"] = (function () {

  var plugin = {};

  plugin.trial = function (display_element, trial) {
    var startTime = (new Date()).getTime();
    var firstInteractionTime;
    var shuffledItems = [];

    trial.title = trial.title || " ";

    trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

    // Load instructions from params
    var itemsFromFile = !!trial.items_file;
    var items_arr;

    if (itemsFromFile) { // load instructions from JSON file
      $.getJSON(trial.items_file, function (data) {
        items_arr = data;
        setup();
      });
    } else {
      items_arr = trial.items;
      setup();
    }

    function setup() {
      //Put all the items into one array.
      Object.keys(items_arr).forEach(function(list) {
          var items = items_arr[list];
          items.forEach(function(item) {
            shuffledItems.push(item);
          });
      });

      // Shuffle the array.
      shuffledItems = shuffle(shuffledItems);

      /* The column where the items will be randomly displayed. */
      var givenColumn = $('<div>', {
        class: "multilist-column"
      });

      var givenColumnList = $('<ul>', {
        class: "multilist-given-values",
      });

      shuffledItems.forEach(function(item) {
        $(givenColumnList).append('<li>' + item + '</li>');
      });

      $(givenColumn).append(givenColumnList);

      var multilistColumnContainer = $('<div>', {
        class: "multilist-list-container",
      });

      Object.keys(items_arr).forEach(function(list, index) {
        $(multilistColumnContainer).append('<div><h3>' + list + '</h3><ol id="list'  + index + '"></ol></div>');
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
      display_element.append($('<h3 style="text-align: center; padding-bottom: 15px;">' + trial.title + '</h3>'));
      display_element.append(givenColumn);
      display_element.append(multilistColumnContainer);
      display_element.append(button);

      var tempLoc;

      /* Make the items sortable. */
      $(".multilist-given-values").sortable({
        connectWith: "ul, ol",
        placerholder: "multilist-placeholder",
        receive: function() {
          $(".pcllab-button-container > button").attr("disabled", true)
        },
        remove: function() {
          if (typeof firstInteractionTime === "undefined") {
            firstInteractionTime = (new Date()).getTime() - startTime;
          }

          if ($(this).children().length === 0) {
            $(".pcllab-button-container > button").attr("disabled", false)
          } else {
            $(".pcllab-button-container > button").attr("disabled", true)
          }
        }
      }).disableSelection();

      $(".multilist-list-container ol").sortable({
        connectWith: "ul, ol",
        placerholder: "multilist-placeholder",
        forcePlaceholderSize: true,
      }).disableSelection();
    }

    function shuffle (array) {
      var clone = $.merge([], array);

      var i = 0, j = 0, temp = null;

      for (i = clone.length - 1; i > 0; i -= 1) {
        j = Math.floor(Math.random() * (i + 1));
        temp = clone[i];
        clone[i] = clone[j];
        clone[j] = temp;
      }

      return clone;
    }

    function arrays_equal(arr1, arr2) {
      if(arr1.length !== arr2.length)
        return false;
      for(var i = arr1.length; i--;) {
        if(arr1[i] !== arr2[i])
          return false;
      }

      return true;
    }

    var overall_correctness = true;

    function get_ordered_lists() {
      var orderedList = [];

      Object.keys(items_arr).forEach(function(list, index) {
        var items = $('#list' + index).find("li");

        orderedList.push({name: list, items: []});

        items.each(function(itemIndex) {
          orderedList[index].items.push($(items[itemIndex]).html());
        });

        // Just check if the array is what we are expecting. Very simple check to see if the list is correct.
        var correctness = arrays_equal(items_arr[list], orderedList[index].items);
        orderedList[index].isCorrect = correctness;

        if (!correctness) {
          overall_correctness = false;
        }


      });

      return orderedList;
    }

    function end_trial() {
      var time = (new Date()).getTime() - startTime;

      var userOrderedLists = get_ordered_lists();

      var trial_data = {
        total_time: time,
        "first_interaction_time": firstInteractionTime || -1,
        "displayedItems": shuffledItems,
        "isCorrect": overall_correctness
      };

      userOrderedLists.forEach(function (list) {
        list.items.forEach(function (item, index) {
          jsPsych.data.write({list: list.name, item: item, index: index})
        });
      });

      display_element.html('');
      jsPsych.finishTrial(trial_data);
    };
  };

  return plugin;
})();
