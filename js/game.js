class Game {
    constructor() {
        this._createGame()
    }

    _createGame() {
        var config = {
            type: Phaser.AUTO,
            width: window.innerWidth,
            height: window.innerHeight,
            scene: {
                preload: () => { this._onGamePreload() },
                create: () => { this._onGameCreate() },
                update: () => { this._onGameUpdate() }
            },
            antialias: false
        };
        
        this.game = new Phaser.Game(config)
    }

    _onGamePreload() {
        this.scene = this.game.scene.scenes[0]
        this.map = new Map(this)
        
        this.scene.load.setBaseURL('/');

        this.scene.load.image('grass', 'assets/grass.png')
        this.scene.load.image('earth', 'assets/earth.png')
    }

    _onGameCreate() {
        this.client = new NetClient(this)

        this.cursors = this.scene.input.keyboard.createCursorKeys()
    }

    _onGameUpdate() {
        var camera = this.scene.cameras.main

        var y = camera.scrollY
        var x = camera.scrollX

        if (this.cursors.left.isDown) {
            x += 10
        }
        if (this.cursors.right.isDown) {
            x -= 10
        }
        if (this.cursors.up.isDown) {
            y += 10
        }
        if (this.cursors.down.isDown) {
            y -= 10
        }

        camera.scrollX = x
        camera.scrollY = y

        // var pointer = this.scene.input.activePointer;
        // if (pointer.isDown) {
        //     var dx = pointer.position.x - pointer.prevPosition.x
        //     camera.x += dx

        //     var dy = pointer.position.y - pointer.prevPosition.y
        //     camera.y += dy
        // }

        this.map.redraw(camera.scrollX, camera.scrollY, camera.width, camera.height)
    }

    reloadMap(dataView) {
        this.map.reload(dataView)
    }
}