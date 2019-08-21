const ResponseId = {
    Ping: 1,
    Map: 2
}

class NetClient {
    constructor(game) {
        this.game = game
        this._createWebsocketClient()
    }

    _createWebsocketClient() {
        var ws = new WebSocket("ws://127.0.0.1:8080")
        ws.binaryType = 'arraybuffer'
        ws.onopen = (event) => {
            console.log('Connected with server')
        }
        ws.onmessage = (event) => {
            var dv = new DataView(event.data)
            var responseId = dv.getUint16(0)

            var buffer = dv.buffer
            var dv2 = new DataView(event.data, 2)

            this._handleEvent(responseId, dv2)
        }
    }

    _handleEvent(responseId, dataView) {
        switch (responseId) {
        case ResponseId.Ping:
            console.log("ping")
        case ResponseId.Map:
            console.log(this, "map")
            this.game.reloadMap(dataView)
        }
    }
}