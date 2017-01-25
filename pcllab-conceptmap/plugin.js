/**
 * @name Concept Map
 *
 * @author Matt Molo
 */

jsPsych.plugins["pcllab-conceptmap"] = (function () {
    var plugin = {}

    plugin.trial = function (display_element, trial) {

        trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial)

        //Set defaults
        trial.lock = trial.lock || false
        trial.title = trial.title || "Concept Map"
        trial.delimiter = trial.delimiter || "*"
        if (trial.shuffle === undefined) {
            trial.shuffle = true
        }
        if (trial.linkText === undefined) {
            trial.shuffle = false
        }

        display_element.load("plugins/pcllab-conceptmap/template.html", function() {

            conceptMap.lock = trial.lock
            conceptMap.linkText = trial.linkText
            $(".content-title").html(trial.title)

            if (trial.wordlist) {
                $(".content").empty()

                if (trial.shuffle) {
                    trial.wordlist = jsPsych.randomization.shuffle(trial.wordlist)
                }

                trial.wordlist.forEach(function(text) {
                    $(".content").addClass("word-bank-content")
                    $(".content").append("<div class='word-bank-container'><span class='dr' style='white-space: normal'>"+text+"</span></div>")
                    $(".content").append("  ")
                })
            }

            function addText(text) {
                var span_start = "<span class='dr'>"
                var span_end = "</span>"

                var delimiter = trial.delimiter
                var inside_selection = false

                //Replace all instances of the delimiter with the span start and span end
                while (text.indexOf(delimiter) >= 0) {
                    replacement = !inside_selection ? span_start : span_end
                    text = text.replace(delimiter, replacement)
                    inside_selection = !inside_selection
                }

                //If there was an unclosed delimiter, then add span end to close it
                if (inside_selection) {
                    text += span_end
                }

                $(".content").append(text)
                $(".content").append("<br><br>")
            }

            if (trial.text) {
                $(".content").empty()
                $(".content").removeClass("word-bank-content")

                //Take care of the text data passed as an array of strings or just a string
                if (Array.isArray(trial.text)) {
                    trial.text.forEach(addText)
                } else {
                    addText(trial.text)
                }
            }

            //Make all the draggable objects draggable into the concept map
            $(".dr").draggable({
                revert: true,
                revertDuration: 0,
                cursor: "pointer",
                scroll: false,
                stop: function( event, ui ) {
                    var offset = $(".canvas").offset()
                    var width = $(".canvas").width()
                    var height = $(".canvas").height()
                    if (ui.offset.left > offset.left && ui.offset.left < offset.left + width &&
                        ui.offset.top  > offset.top  && ui.offset.top  < offset.top + height) {
                            conceptMap.addNode(new Node(ui.offset.left - offset.left, ui.offset.top - offset.top, this.innerText))
                            $(this).removeClass("dr")
                            $(this).addClass("dragged-word")
                            $(this).draggable("disable")
                        }
                }
            })

            $('.finish').click(function() {
                var connections = conceptMap.connections.map(function(conn) {
                    return {
                        start_node: conn.startNode.text,
                        end_node: conn.endNode.text
                    }
                })

                var nodes = conceptMap.nodes.map(function(node) {
                    return {
                        text: node.text,
                        linkNode: node.linkNode
                    }
                })

                var image = canvasElem.toDataURL()

                var trial_data = {
                    nodes: nodes,
                    connections: connections,
                    image: image
                }

                $.post("plugins/pcllab-conceptmap/save.php", {
                    data: image,
                    workerId: 555555
                })

                display_element.html('')
                jsPsych.finishTrial(trial_data)
            })
        })
    }

    return plugin
})()
