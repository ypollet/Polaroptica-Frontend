import * as math from 'mathjs'
import { defineStore, type PiniaPluginContext, type StateTree } from 'pinia'
import { DequeMax2 } from '@/data/models/dequeMax2'
import { Distance } from '@/data/models/distance'
import { Landmark } from '@/data/models/landmark'
import Color from 'color'
import type { RotationImage, Size } from '@/data/models/rotation_image'
import { RepositoryFactory } from '@/data/repositories/repository_factory'
import { repositorySettings } from '@/config/appSettings'

const repository = RepositoryFactory.get(repositorySettings.type)

export const DEFAULT_TAB = "viewer"

export const useSettingsStore = defineStore('settings', {
  state: () => ({ isLeft : false }),
  actions: {
    useToggleLeft(value : boolean){
      this.isLeft = value
    },
  },

  persist: {
    storage: localStorage,
    key: 'settings',
  }
})


export const useImagesStore = defineStore('images', {
  state: () => ({
    objectPath: "",
    index : 0,
    rotationImages : new Array<RotationImage>(),
    anglesMap : new Map<number,number>(),
    size : { width : -1, height : -1},
    zoom : -1,
    offset : {x:0, y:0},
    zoomRect: {
      top: 0,
      left: 0,
      width: 0,
      height:0 
    },
  }),
  getters: {
    selectedImage : (state) => (state.index >= 0 && state.index < state.rotationImages.length) ?  state.rotationImages[state.index] : {"name":"RBINS Logo", "label":"RBINS Logo","angle": -1,"image":"https://www.naturalsciences.be/bundles/8c62adb1e0fbef009ef7c06c69a991890012e203/img/logos/logo.svg", "thumbnail":""},
    angleRotations : (state) => new Set(state.rotationImages.map((image) => image.angle)),
    angle: (state) => (state.index >= 0 && state.index < state.rotationImages.length) ? state.rotationImages[state.index].angle : -1
  },
  actions: {
    setPath(path : string) {
      this.$reset()
      this.objectPath = path
    },
    setIndex(index : number){
      this.index = (this.rotationImages.length + index ) % this.rotationImages.length
      
    },
    moveIndex(move: number) {
      this.index = (this.rotationImages.length + this.index + move ) % this.rotationImages.length
    },
    increment(){
      this.moveIndex(1)
    },
    decrement(){
      this.moveIndex(-1)
    },
    getImageName(index : number){
      return (index >= 0 && index < this.rotationImages.length) ? this.rotationImages[index].label : "Image " + index
    }

  },

  persist: {
    storage: sessionStorage,
    key: 'images'
  },
})

export const useLandmarksStore = defineStore('landmarks', {
  state: () => ({ 
    landmarks: Array<Landmark>(),
    distances: Array<Distance>(),
    adjustFactor: 1,
    scale: "px",
    tab: "landmarks",
    selectedDistanceIndex: -1
  }),
  getters:{
    indexes: (state) => new Map(state.distances.map((distance, index) => [distance.label, index])),
    selectedDistance : (state) => (state.selectedDistanceIndex >= 0 && state.selectedDistanceIndex < state.distances.length) ? state.distances[state.selectedDistanceIndex] :  null
  },
  actions: {
    generateID() {
      let check: boolean = false
      let id: string = ""
      while (!check) {
        id = (Math.random() + 1).toString(36).substring(2);
        this.distances.forEach(distance => {
          if (distance.landmarks.filter(e => e.equals(id)).length == 0) {
            check = true
          }
        })
        if (this.landmarks.filter(e => e.equals(id)).length == 0) {
          check = true
        }
      }
      return id;
    },
  },
  persist: {
    storage: sessionStorage,
    key: 'landmarks',
    afterHydrate: (ctx: PiniaPluginContext) => {
      // restore landmarks
      let landmarks = new Array<Landmark>()
      ctx.store.$state.landmarks.forEach((jsonObject : Landmark) => {
        let landmark = new Landmark(jsonObject.id, jsonObject.label, jsonObject.pose, jsonObject.position, Color(jsonObject.color))
        landmarks.push(landmark)
      })
      ctx.store.$state.landmarks = landmarks

      let distances = new Array<Distance>()
      ctx.store.$state.distances.forEach((jsonObject : Distance) => {
        let landmarks = jsonObject.landmarks.map((x : Landmark) => new Landmark(x.id, x.label, x.pose, x.position, Color(x.color)))
        let distance = new Distance(jsonObject.label, landmarks, Color(jsonObject.color))
        distances.push(distance)
      })
      ctx.store.$state.distances = distances
    },
  },
})