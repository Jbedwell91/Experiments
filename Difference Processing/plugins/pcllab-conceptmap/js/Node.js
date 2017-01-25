function Node(x, y, text) {

    this.x = x
    this.y = y
    this._text = text || ""

    this.fill = "#5DC6BC"
    this.stroke = "3px #23b6b8"
    this.highlightedStroke  = "3px #125B5C"
    this.editStroke = "4px #FFAA00"
    this.errorFill = "#D32F2F"
    this.errorStroke = "3px #B71C1C"
    this.minWidth = 130
    this.minHeight = 30
    this.font = "20px Oxygen"
    this.linkNode = false

    this._selected = false

    this.editing = false

    this.connections = []

    //init
    this.nodeObject = canvas.display.rectangle({
        x: this.x,
        y: this.y,
        width: this.minWidth,
        height: this.minHeight,
        origin: {x: "center", y: "center"},
        fill: this.fill,
        stroke: this.stroke,
        join: "round"
    })

    this.nodeObject.parentNode = this


    this._select = function(event) {
        if (conceptMap.selectedNode !== this.parentNode) {
            conceptMap.deselect()

            this.parentNode.normal()
            this.parentNode.selected = true
            conceptMap.selectedNode = this.parentNode
        }


        if (event) event.stopPropagation()
    }

    this.nodeObject.bind("click", this._select)

    this.nodeObject.bind("dblclick", function(event) {
        if (conceptMap.selectedNode == this.parentNode) {
            this.parentNode.edit()
        }

        event.stopPropagation()
    })

    this.nodeObject.dragAndDrop({
        changeZindex: true,
        start: this._select,
        move: function() {
            var nodeObject = this
            this.parentNode.connections.forEach(function(connection) {
                if (connection.startNode === nodeObject.parentNode) {
                    connection.start = {
                        x: nodeObject.x,
                        y: nodeObject.y
                    }
                } else if (connection.endNode === nodeObject.parentNode) {
                    connection.end = {
                        x: nodeObject.x,
                        y: nodeObject.y
                    }
                }
            })
        },
        end: function() {
            this.parentNode.x = this.x
            this.parentNode.y = this.y
        }
    })

    this.nodeObject.bind("mouseenter", function() {
        conceptMap.insideNode = this.parentNode
    })

    this.nodeObject.bind("mouseleave", function() {
        if (conceptMap.insideNode == this.parentNode)
            conceptMap.insideNode = undefined
    })

    this.textObject = canvas.display.text({
        x: 0,
        y: 0,
        origin: {x: "center", y: "center"},
        align: "center",
        font: this.font,
        text: text,
        fill: "white"
    })

    this.text = this._text

    this.nodeObject.addChild(this.textObject)

    canvas.addChild(this.nodeObject)
    canvas.redraw()
}

Node.prototype = {
    constructor: Node,

    //change the stroke when we set this.selected
    set selected(val) {
        this._selected = val

        if (this._selected) {
            this.nodeObject.stroke = this.highlightedStroke

            this.nodeObject.addChild(conceptMap.drawPoint)
            conceptMap.drawPoint.y = -this.nodeObject.height/2 - 8
            conceptMap.drawPoint.opacity = 1
        } else {
            this.nodeObject.stroke = this.stroke

            conceptMap.drawPoint.remove()
        }

        canvas.redraw()
    },

    get selected() {
        return this._selected
    },

    //automatically resize when we set text
    set text(val) {
        if (typeof val !== 'string') {
            return
        }

        this.textObject.text = val

        if (this.textObject.width > this.minWidth-20) {
            this.nodeObject.width = this.textObject.width + 20
        } else {
            this.nodeObject.width = this.minWidth
        }

        this._text = val

        canvas.redraw()

    },

    get text() {
        return (this._text) ? this._text.trim() : "";
    },

    //return to normal unselected state
    normal: function() {
        this.selected = false
        this.nodeObject.fill = this.fill
        this.textObject.opacity = 1
    },

    edit: function() {
        if (!conceptMap.lock || this.linkNode) {
            this.nodeObject.stroke = this.editStroke
            this.textObject.opacity = 0
            conceptMap.editNode()
            canvas.redraw()
        }
    },

    remove: function() {
        var _parentNode = this
        this.connections.forEach(function(connection) {
            if (connection.startNode == _parentNode) {
                connection.endNode.removeConnection(connection)
            } else if (connection.endNode == _parentNode) {
                connection.startNode.removeConnection(connection)
            }
            conceptMap.removeConnection(connection)
            connection.remove()
        })
        this.nodeObject.remove()
    },


    addConnection: function(connection) {
        this.connections.push(connection)
    },

    removeConnection: function(connection) {
        var i = this.connections.indexOf(connection)

        this.connections.splice(i, 1)
    },

    error: function() {
        this.nodeObject.fill = this.errorFill
        this.nodeObject.stroke = this.errorStroke
    }
}


function LinkNode(x, y, text) {
    Node.apply(this, arguments)
    this.stroke = "0px #fff"
    this.highlightedStroke = "2px #eee"
    this.editStroke = "3px #888"
    this.fill = "#fff"
    this.minHeight = 20
    this.minWidth = 55
    this.nodeObject.height = 20
    this.nodeObject.width = 55
    this.textObject.fill = "black"
    this.textObject.font = "12px Oxygen"
    this.linkNode = true
}

LinkNode.prototype = Node.prototype;        // Set prototype to Person's
LinkNode.prototype.constructor = LinkNode;   // Set constructor back to Robot
