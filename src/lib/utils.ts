export { cn } from "cn"
import type { Coordinates } from "@/data/models/coordinates";
import * as math from 'mathjs';

export function degreesToRad(deg: number) {
  return (deg * math.pi) / 180.0;
}

export function radToDegrees(rad: number) {
  return (rad * 180.0) / math.pi;
}

export function computeDistance(intervals: Coordinates[]): number {
    let dist = 0
    intervals.forEach((interval: Coordinates) => {
        let squared = math.map(Object.values(interval), math.square)
        let sum = math.sum(squared)
        // can't be a Complex number
        dist += math.sqrt(sum) as number
    })
    return dist
}


export enum Scale {
    px = 1,
    m = 1000,
    dm = 100,
    cm = 10,
    mm = 1,
    µm = 0.001,
    nm = 0.000001,
}


export const ZOOM_MIN = 0.1
export const ZOOM_MAX = 4
export const DOT_RADIUS = 4.5
export const SPACE_TARGET = 0.2
export const ROUNDING = 2

