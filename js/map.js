const CellType = {
    Earth = 1
}

class Map {
    reload(dataView) {
        this.width = dataView.getUint32(0)
        this.height = dataView.getUint32(4)

        this.firstCellByteOffset = 8
        this.cellByteSize = 1
        this.dataView = dataView

        console.log(width, height)
    }

    cellTypeAt(x, y) {
        var index = x + y * this.width
        var byteOffset = this.firstCellByteOffset + this.cellByteSize * index
        var cellType = dv.getUint8(byteOffset)
        return cellType
    }
}