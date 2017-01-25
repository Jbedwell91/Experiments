function ConceptMap() {
    this.nodes = []
    this.connections = []
    this.insideNode = undefined
    this.selectedNode = undefined
    this.editingLine = undefined
    this.selectedLine = undefined

    this.lock = false

    this.textEditing = false

    this.drawPoint = canvas.display.ellipse({
        x: 0,
        y: 0,
        origin: {x: "center", y: "center"},
        align: "center",
        radius: 12,
        fill: "#125B5C",
        opacity: 0
    })

    this.pencil = canvas.display.image({
        x: 0,
        y: 0,
        width: 14,
        height: 14,
        origin: {x: "center", y: "center"},
        align: "center",
        image: "plugins/pcllab-conceptmap/images/pencil.svg"
    })

    this.drawPoint.addChild(this.pencil)
    this.drawPoint.conceptMap = this

    this.drawPoint.bind("mousedown", function(event) {
        if (this.conceptMap.selectedNode) {

            event.stopPropagation()

            this.conceptMap.selectedNode.editing = true

            this.conceptMap.editingConnection = new Connection(this.conceptMap.selectedNode)

            $(".canvas-holder").css("cursor",'url("plugins/pcllab-conceptmap/images/pencil_black.svg"), crosshair')
        }
    })


}

ConceptMap.prototype = {

    addNode: function(node) {
        this.nodes.push(node)
    },

    removeNode: function(node) {
        var i = this.nodes.indexOf(node)
        this.nodes.splice(i, 1)
        node.remove()
    },

    addConnection: function(connection) {
        this.connections.push(connection)
    },

    removeConnection: function(connection) {
        var i = this.connections.indexOf(connection)
        this.connections.splice(i, 1)
    },

    removeSelected: function() {
        this.removeNode(this.selectedNode)
    },

    removeLine: function() {
        if (this.selectedLine) {
            this.selectedLine.startNode.removeConnection(this.selectedLine)
            this.selectedLine.endNode.removeConnection(this.selectedLine)
            this.removeConnection(this.selectedLine)
            this.selectedLine.remove()
            this.selectedLine = undefined
        }
    },

    deselect: function() {
        if (conceptMap.selectedNode !== undefined) {
            conceptMap.selectedNode.normal()
            conceptMap.selectedNode = undefined
        }

        if (conceptMap.selectedLine !== undefined) {
            conceptMap.selectedLine.selected = false
            conceptMap.selectedLine = undefined
        }

        if (conceptMap.textEditing)
            conceptMap.stopEdit()
    },

    editNode: function() {
        if (this.selectedNode !== undefined && !this.textEditing) {
            if (this.selectedNode.linkNode) {
                editableWord.addClass('editable-word-link')
            } else {
                editableWord.removeClass('editable-word-link')
            }

            editableWord.val(this.selectedNode.text)
            wordElem.css("left", this.selectedNode.x + "px")
            wordElem.css("top",  this.selectedNode.y - (this.selectedNode.minHeight/2)+"px")
            editableWord.css("width", this.selectedNode.textObject.width*2)
            wordElem.show()
            editableWord.focus()
            setTimeout(function() {
                editableWord.focus()
            }, 100)

            this.textEditing = true
        }
    },

    stopEdit: function() {
        editableWord.val("")
        wordElem.hide()

        this.textEditing = false
    },

    reset: function() {
        this.deselect()
        this.nodes.forEach(function(node) {
            node.normal()
        })
    }
}
