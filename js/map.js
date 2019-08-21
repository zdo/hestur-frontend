const CellType = {
    Earth: 1
}

class CachedMapTexture {
    constructor(scene, size) {
        this.texture = scene.add.renderTexture(0, 0, size, size)
        this.reset()
    }

    reset() {
        this.drawCallsWithoutBeingUsed = 0
        this.x = null
        this.y = null
    }
}

class Map {
    constructor(game) {
        this.game = game
        
        this.cachedTextures = []
        this.cachedTexturesMap = {}

        this.cellSize = 32
        this.texSize = this.cellSize * 32
        this.cellsPerTex = this.texSize / this.cellSize


        // var r = this.game.scene.add.rectangle(0, 0, 1500, 1500, 0xff0000)
        // r.setOrigin(0)
        
        // r = this.game.scene.add.rectangle(300, 300, 3600, 100, 0x0000ff)
        // r.setOrigin(0)
        // this.game.scene.add.rectangle(1000, 500, 6000, 1500, 0x00ff00)
    }

    reload(dataView) {
        this.width = dataView.getUint32(0)
        this.height = dataView.getUint32(4)

        this.cellsDataView = new DataView(dataView.buffer, dataView.byteOffset + 8)
        this.cellByteSize = 1

        console.log("Recreate map", this.width, this.height)

        this.game.scene.cameras.main.setBounds(0, 0, this.width * this.cellSize, this.height * this.cellSize)
    }

    cellTypeAt(x, y) {
        if (!this.cellsDataView) {
            return null
        }
        if (x < 0 || y < 0) {
            return null
        }
        if (x >= this.width || y >= this.height) {
            return null
        }

        var index = x + y * this.width
        var byteOffset = this.cellByteSize * index
        var cellType = this.cellsDataView.getUint8(byteOffset)
        if (y == 3) {
        console.log(x, y, cellType)
        }
        return cellType
    }

    redraw(offsetX, offsetY, width, height) {
        var minX = Math.floor(offsetX / this.texSize)
        var minY = Math.floor(offsetY / this.texSize)
        var maxX = Math.floor((offsetX + width) / this.texSize)
        var maxY = Math.floor((offsetY + height) / this.texSize)

        console.log("Redraw map", offsetX, offsetY, width, height, "-", minX, maxX)


        for (var x = minX; x <= maxX; ++x) {
            for (var y = minY; y <= maxY; ++y) {
                this._drawTexture(x, y, x * this.texSize, y * this.texSize)
            }
        }

        this.cachedTextures.forEach(tex => {
            tex.drawCallsWithoutBeingUsed += 1
        })

        if (offsetX > 0) {
            // throw 2
        }
        
    }

    _textureKey(x, y) {
        var key = `${x}_${y}`
        return key
    }

    _drawTexture(texX, texY, offsetX, offsetY) {
        if (!this.cellsDataView) {
            return
        }

        var tex = null

        var key = this._textureKey(texX, texY)
        tex = this.cachedTexturesMap[key]
        if (!tex) {
            tex = this.cachedTextures.filter(tex => { tex.drawCallsWithoutBeingUsed > 10 })[0]
            var oldKey = null

            if (tex) {
                oldKey = this._textureKey(tex.x, tex.y)
            } else {
                console.log("Create texture", texX, texY)
                tex = new CachedMapTexture(this.game.scene, this.texSize)

                this.cachedTextures.push(tex)
            }

            console.log("Draw texture", texX, texY)
            tex.texture.clear();

            // tex.texture.add.rectangle(0, 0, this.texSize -1, this.texSize-1, "ff0000");

            for (var y = 0; y < this.cellsPerTex; ++y) {
                for (var x = 0; x < this.cellsPerTex; ++x) {
                    var cellX = x + texX * this.cellsPerTex
                    var cellY = y + texY * this.cellsPerTex

                    var cellType = this.cellTypeAt(cellX, cellY)
                    var dx = this.cellSize * x
                    var dy = this.cellSize * y


                    if (x == this.cellsPerTex - 1) {
                        dx -= 2
                    }
                    if (y == this.cellsPerTex - 1) {
                        dy -= 2
                    }

                    if (cellType !== null) {
                        var texName = cellType == 1 ? "grass" : "earth"
                        tex.texture.draw(texName, dx, dy)
                    }
                }
            }

            if (oldKey) {
                delete this.cachedTexturesMap[oldKey]    
            }

            tex.x = texX
            tex.y = texY
            this.cachedTexturesMap[key] = tex
        }

        tex.drawCallsWithoutBeingUsed = 0

        // console.log("Draw texture", texX, texY, offsetX, offsetY)
        tex.texture.x = offsetX
        tex.texture.y = offsetY

        

    }
}