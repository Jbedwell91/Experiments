//Set the canvasElem to the correct size, filling out the screen
var canvasElem = document.getElementById("canvas")
canvasElem.setAttribute('width', $(".canvas-holder").width())
canvasElem.setAttribute('height', $(".canvas-holder").height())

var wordElem = $(".word-elem")
var editableWord = $('.editable-word')

var canvas = oCanvas.create({
    canvas: "#canvas",
})

var conceptMap = new ConceptMap()

canvas.bind("dblclick", function() {

    //Create a new node on double click
    if (conceptMap.insideNode === undefined && !conceptMap.lock) {
        conceptMap.addNode(new Node(canvas.mouse.x, canvas.mouse.y, ""))
    }

    conceptMap.deselect()

})

canvas.bind("click", function() {

    if (conceptMap.selectedNode && conceptMap.selectedNode.editing == false) {
        conceptMap.deselect()
    }

    if (conceptMap.selectedNode && conceptMap.selectedNode.editing == true) {
        conceptMap.selectedNode.editing = false
    }

    if (conceptMap.selectedLine) {
        conceptMap.deselect()
    }
})

canvas.bind("mouseup", function() {
    if (conceptMap.editingConnection !== undefined) {
        if (conceptMap.insideNode !== undefined) {
            if (conceptMap.editingConnection.startNode == conceptMap.insideNode) {
                conceptMap.editingConnection.remove()
            } else if (conceptMap.editingConnection.startNode.linkNode && conceptMap.insideNode.linkNode) {
                conceptMap.editingConnection.remove()
            } else {
                var match = false
                conceptMap.editingConnection.startNode.connections.forEach(function(conn) {
                    if (conn.startNode == conceptMap.editingConnection.startNode && conn.endNode == conceptMap.insideNode) {
                        match = true
                    } else if (conn.startNode == conceptMap.insideNode && conn.endNode == conceptMap.editingConnection.startNode) {
                        match = true
                    }
                })

                if (match) {
                    conceptMap.editingConnection.remove()
                } else {
                    if (conceptMap.linkText) {
                        if (conceptMap.editingConnection.startNode.linkNode || conceptMap.insideNode.linkNode) {
                            conceptMap.editingConnection.dontSplit = true
                            conceptMap.editingConnection.setEndNode(conceptMap.insideNode)
                            conceptMap.addConnection(conceptMap.editingConnection)

                            conceptMap.editingConnection.startNode.addConnection(conceptMap.editingConnection)
                            conceptMap.insideNode.addConnection(conceptMap.editingConnection)
                        } else {
                            conceptMap.editingConnection.setEndNode(conceptMap.insideNode)
                            conceptMap.editingConnection.remove()
                        }
                    } else {
                        conceptMap.editingConnection.setEndNode(conceptMap.insideNode)
                        conceptMap.addConnection(conceptMap.editingConnection)

                        conceptMap.editingConnection.startNode.addConnection(conceptMap.editingConnection)
                        conceptMap.insideNode.addConnection(conceptMap.editingConnection)
                    }

                    if (conceptMap.autoGrade) grade()
                }
            }

        } else {
            if (conceptMap.lock || conceptMap.editingConnection.startNode == conceptMap.insideNode) {
                conceptMap.editingConnection.remove()
            } else {
                var newNode = new Node(canvas.mouse.x, canvas.mouse.y, "")
                conceptMap.addNode(newNode)

                if (conceptMap.editingConnection.startNode.linkNode) {
                    conceptMap.editingConnection.dontSplit = true
                    conceptMap.editingConnection.setEndNode(newNode)
                    conceptMap.addConnection(conceptMap.editingConnection)
                    conceptMap.editingConnection.startNode.addConnection(conceptMap.editingConnection)
                    newNode.addConnection(conceptMap.editingConnection)
                } else {
                    conceptMap.editingConnection.setEndNode(newNode)
                    conceptMap.editingConnection.remove()
                }

                if (conceptMap.autoGrade) grade()
            }
        }
        conceptMap.editingConnection = undefined

        $(".canvas-holder").css("cursor",'default')
    }
})


canvas.bind("keydown", function (event) {

    //Removed on node on keyevents 46 (delete) and backspace (8)
    if (event.which == 46 || event.which == 8) {

        if (!conceptMap.textEditing) {

            event.preventDefault()

            if (!conceptMap.lock || conceptMap.selectedNode.linkNode) {
                if (conceptMap.selectedNode) {
                    conceptMap.removeSelected()
                    ConceptMap.selectedNode = undefined
                }
            }

            if (conceptMap.selectedLine) {
                conceptMap.removeLine()
                ConceptMap.selectedLine = undefined
                if (conceptMap.autoGrade) grade()
            }
        }

    } else if (String.fromCharCode(event.which).match(/[a-zA-Z0-9]/)) {
        if (conceptMap.selectedNode) {
            conceptMap.selectedNode.edit()
        }
    } else if (event.which == 13) {
        if (conceptMap.textEditing) {
            conceptMap.deselect()
            event.preventDefault()
        }
    }

})

canvas.setLoop(function() {
    if (conceptMap.editingConnection !== undefined) {
        conceptMap.editingConnection.end = {
            x: canvas.mouse.x,
            y: canvas.mouse.y
        }
    }
    canvas.redraw
}).start()

function editKeyChange() {
    if (conceptMap.selectedNode !== undefined) {
        var text = editableWord.val()
        conceptMap.selectedNode.text = text
    }

    var width = conceptMap.selectedNode.textObject.width
    if (width > conceptMap.selectedNode.minWidth-20) {
        $('.editable-word').width(width + 20)
    } else {
        $('.editable-word').width(conceptMap.selectedNode.minWidth)
    }
}

function resize() {
    canvasElem.setAttribute('width', $(".canvas-holder").width())
    canvasElem.setAttribute('height', $(".canvas-holder").height())
    canvas.width = $(".canvas-holder").width()
    canvas.height = $(".canvas-holder").height()
}

$(window).resize(resize)
//Resize the canvas after 1/2 second, because it needs sometime to reflow
setTimeout(resize, 500)
