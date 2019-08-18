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
                preload: this._onGamePreload,
                create: this._onGameCreate,
                update: this._onGameUpdate
            },
            antialias: false
        };
        
        this.game = new Phaser.Game(config)
    }

    _onGamePreload() {
        // this.load.setBaseURL('http://labs.phaser.io');
        this.load.setBaseURL('/');

        this.load.image('grass', 'assets/grass.png')
        this.load.image('earth', 'assets/earth.png')
    }

    _onGameCreate() {
        this.scene = this.game.scene

        this.client = new NetClient(this)

        this.cursors = this.input.keyboard.createCursorKeys()
    }

    _onGameUpdate() {
        var camera = this.scene.scenes[0].cameras.main
        if (this.cursors.left.isDown) {
            camera.x -= 10
        }
        if (this.cursors.right.isDown) {
            camera.x += 10
        }
        if (this.cursors.up.isDown) {
            camera.y -= 10
        }
        if (this.cursors.down.isDown) {
            camera.y += 10
        }

        var pointer = this.game.input.activePointer;
        if (pointer.isDown) {
            var dx = pointer.position.x - pointer.prevPosition.x
            camera.x += dx

            var dy = pointer.position.y - pointer.prevPosition.y
            camera.y += dy
        }
    }
}