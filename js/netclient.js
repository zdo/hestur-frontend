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
        if (responseId == 2) {
            var width = dataView.getUint32(0)
            var height = dataView.getUint32(4)
            console.log(width, height)

            // var tileMap = Phaser.Tilemap(this, )

            // for (var x = 0; x < width; ++x) {
            //     for (var y = 0; y < height; ++y) {
            //         var i = x + y * width
            //         var cellType = dv.getUint8(2 + i)
            //         this.add.image(x * 32,
            //             16 + y * 32,
            //             cellType == 0 ? 'earth' : 'grass')
            //     }
            // }
        }
    }
}