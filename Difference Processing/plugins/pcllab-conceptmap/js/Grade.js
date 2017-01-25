function displayError(e) {
    if(typeof e !== 'undefined') {
        $(".error").css("display", "block")
        $(".error").html(e)
    } else {
        $(".error").css("display", "none")
    }
}

function save() {
    var nodes = conceptMap.nodes.map(function(node) {
        return {
            Node: node.text,
            Connections: node.connections.map(function(conn) {
                if (conn.startNode == node) {
                    return conn.endNode.text
                } else {
                    return conn.startNode.text
                }
            })
        }
    })

    return nodes
}

String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();})
}

function grade() {
    console.log(gradeUrl)
    $.getJSON(gradeUrl, function(data) {
        conceptMap.reset()

        var conns = conceptMap.connections

        var verified = true
        for (var i = 0; i < conns.length; i++) {
            var found = -1

            for (var j = 0; j < data.length; j++) {
                if (data[j][0].toLowerCase() == conns[i].startText() && data[j][1].toLowerCase() == conns[i].endText()) {
                    found = j
                } else if (data[j][1].toLowerCase() == conns[i].startText() && data[j][0].toLowerCase() == conns[i].endText()) {
                    found = j
                }
            }

            if (found < 0) {
                conns[i].error()
                verified = false
            } else {
                data.splice(found, 1)
            }
        }

        if (data.length > 0) {
            displayError(data[0][2])
            verified = false
        }

        if (verified) finish()
    })
}
