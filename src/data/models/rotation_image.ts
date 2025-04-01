export type RotationImage = {
    name: string,
    label: string,
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
    height: number,
    width: number
}