export type RotationImage = {
    name: string,
    angle: number,
    image: string,
    thumbnail: string
}

export type Size = {
    height: number,
    width: number
}

export type ProjectData = {
    rotationImages: Array<RotationImage>,
    size: Size,
    thumbnails : boolean
}

export type Ratio = {
    ratioH: number,
    ratioW: number
}