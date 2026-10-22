import Color from "color"
import type { Coordinates, Position } from "@/data/models/coordinates"
import type { RotationImage } from "./rotation_image"

export type Pose = {
    marker: Coordinates
    image: RotationImage
}

export type LandmarkObject = {
    id: string
    label: string
    pose: Pose
    position : Position
    color: string
}

export class Landmark {
    id: string
    label: string
    pose: Pose
    position : Position
    color: Color
    show: boolean
    edit: boolean
    isClicked: boolean
    isDragged: boolean

    constructor(id: string, label: string, pose: Pose, position : Position, color: Color | null = null) {
        this.id = id
        this.label = label
        this.pose = pose
        this.position = position
        this.edit = false
        this.color = color || Color.rgb([Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)])
        this.show = true
        this.isClicked = false
        this.isDragged = false
    }

    equals(other : Landmark | string | null){
        if(other == null){
            return false
        }
        if(typeof other === "string"){
            return this.id == other
        }
        return this.id == other.id
    }

    static fromJSON(landmark : LandmarkObject){
        return new Landmark(landmark.id, landmark.label, landmark.pose, landmark.position, Color(landmark.color))
    } 

    toJSON() {
        return { id: this.id, label: this.label, pose: this.pose, position : this.position, color: this.color.hex() }
    }

    getId() : string {
        return this.id
    }
    getLabel() : string {
        return this.label
    }
    setLabel(label : string){
        this.label = label
    }
    
    getColorHEX() : string{
        return this.color.hex()
    }
    setColorHEX(color: string) {
        this.color = Color(color)
    }
    setColorRGB(color: number[]) {
        if (color.length < 3) {
            return
        }
        this.color = Color.rgb(color[0], color[1], color[2])
    }

    setPose(image : RotationImage, pose: Coordinates) {
        this.pose = {
            marker : pose,
            image : image
        }
    }
    
    getPose() : Pose {
        return this.pose
    }

    setPosition(position : Position) {
        this.position = position
    }

    getPosition() : Position {
        return this.position
    }

    
    getEdit() : boolean{
        return this.edit
    }
    setEdit(edit : boolean){
        this.edit = edit
    }
}