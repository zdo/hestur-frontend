var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    antialias: false
};

var game = new Phaser.Game(config)
var cursors

function preload() {
    // this.load.setBaseURL('http://labs.phaser.io');
    this.load.setBaseURL('/');

    this.load.image('grass', 'assets/grass.png')
    this.load.image('earth', 'assets/earth.png')
}

function create() {
    var ws = new WebSocket("ws://127.0.0.1:8080")
    ws.binaryType = 'arraybuffer'
    ws.onopen = (event) => {
        console.log('open')
        // ws.send(JSON.stringify({"id": "map"}), { binary: true })
    }
    ws.onmessage = (event) => {
        console.log('event', typeof event.data)

        var dv = new DataView(event.data)
        var responseId = dv.getUint16(0)

        console.log(responseId)

        if (responseId == 2) {
            var width = dv.getUint32(2)
            var height = dv.getUint32(6)
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

    cursors = this.input.keyboard.createCursorKeys()
    console.log(game)
}

function update() {
    var scene = this
    var camera = scene.cameras.main
    if (cursors.left.isDown) {
        camera.x -= 10
    }
    if (cursors.right.isDown) {
        camera.x += 10
    }
    if (cursors.up.isDown) {
        camera.y -= 10
    }
    if (cursors.down.isDown) {
        camera.y += 10
    }

    var pointer = scene.input.activePointer;
    if (pointer.isDown) {
        var dx = pointer.position.x - pointer.prevPosition.x
        camera.x += dx

        var dy = pointer.position.y - pointer.prevPosition.y
        camera.y += dy
    }
}
