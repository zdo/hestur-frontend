const ResponseId = {
    Ping: 1,
    Map: 2,
    Character: 3
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
            break
        case ResponseId.Map:
            console.log(this, "map")
            this.game.reloadMap(dataView)
            break
        case ResponseId.Character:
            // break
            // console.log(this, "character")
            // this.game.reloadMap(dataView)

            var offset = 0
            
            var characterId = dataView.getUint32(offset)
            offset += 4

            var character = this.game.obtainCharacter(characterId)

            var isFullSerialization = (dataView.getUint8(offset) > 0)
            offset += 1

            character.isDied = (dataView.getUint8(offset) != 0)
            offset += 1

            if (isFullSerialization) {
                var strLength = dataView.getUint16(offset)
                offset += 2

                var chars = []
                for (var i = 0; i < strLength; ++i) {
                    chars.push(dataView.getUint8(offset))
                    offset += 1
                }

                character.name = String.fromCharCode.apply(null, chars)
            }

            var x = dataView.getFloat32(offset)
            offset += 4

            var y = dataView.getFloat32(offset)
            offset += 4

            character.setPosition(x, y)

            if (isFullSerialization) {
                var typeChars = []
                for (var i = 0; i < 4; ++i) {
                    typeChars.push(dataView.getUint8(offset))
                    offset += 1
                }
                character.type = String.fromCharCode.apply(null, typeChars)
            }

            break
        }
    }
}