<script setup lang="ts">
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@/components/ui/menubar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

import { Landmark, type LandmarkObject } from '@/data/models/landmark'
import { Distance, type DistanceObject } from '@/data/models/distance'


import { useToggle, useDark } from '@vueuse/core'
import { useSettingsStore, useLandmarksStore, useImagesStore } from '@/lib/stores'
import saveAs from 'file-saver';

const settingsStore = useSettingsStore()
const landmarksStore = useLandmarksStore()
const imagesStore = useImagesStore()

const isDark = useDark({
  storageKey: 'localStorage'
})

const toggleDark = useToggle(isDark)

function date2string(date: Date) {
  let day = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`
  let time = `${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}${date.getSeconds().toString().padStart(2, '0')}`
  return `${day}-${time}`;
}


function downloadCsv() {
  const rows = [
    ["Distance", "Label", "Color", "Pose_X", "Pose_Y", "Image", "X", "Y", "Z"]
  ];

  landmarksStore.landmarks.forEach((landmark) => {
    let pose = landmark.pose
    let position = landmark.position
    let row: Array<string> = ["", landmark.label, landmark.getColorHEX(), pose.marker.x.toString(), pose.marker.y.toString(), pose.image.name, position.x.toString(), position.y.toString()]
    rows.push(row)
  })

  landmarksStore.distances.forEach((distance) => {
    distance.landmarks.forEach((landmark) => {
      landmark = landmark as Landmark
      let pose = landmark.pose
      let position = landmark.position
      let row: Array<string> = [distance.label, landmark.label, landmark.getColorHEX(), pose.marker.x.toString(), pose.marker.y.toString(), pose.image.name, position.x.toString(), position.y.toString()]
      rows.push(row)
    })
  })

  let csvContent = rows.map(e => e.join(";")).join("\n");

  let formattedDate = date2string(new Date())

  let blob: Blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  saveAs(blob, "anno_polar_" + imagesStore.objectPath + "_" + formattedDate + ".csv")
}

function downloadJSON() {
  const data: Map<string, any> = new Map()

  data.set('scale_factor', landmarksStore.adjustFactor)

  data.set('landmarks', landmarksStore.landmarks.map((landmark) => landmark.toJSON()))
  data.set('distances', landmarksStore.distances.map((distance) => distance.toJSON()))

  let formattedDate = date2string(new Date())

  var blob = new Blob([JSON.stringify(Object.fromEntries(data.entries()))], { type: "application/json;charset=utf-8" });
  saveAs(blob, "anno_polar_" + imagesStore.objectPath + "_" + formattedDate + ".json");
}

function onSubmit(event: Event) {
  event.preventDefault()
  let form = event.target as HTMLFormElement
  let inputFile = form.elements[0] as HTMLInputElement
  let file = inputFile.files![0] as Blob
  if (file) {
    file.text().then((text) => {
      importLandmarks(text)
    }).catch((reason) => {
      console.error(reason)
    })
  }
}
function importLandmarks(jsonData: string) {
  let jsonObject = JSON.parse(jsonData)
  let mapData: Map<string, any> = new Map(Object.entries(jsonObject));
  landmarksStore.adjustFactor = mapData.get("scale_factor")

  let mapLandmarks: Array<LandmarkObject> = mapData.get("landmarks")

  mapLandmarks.forEach((landmarkObject: LandmarkObject) => {
    landmarksStore.landmarks.push(Landmark.fromJSON(landmarkObject))
  })

  let mapDistances: Array<DistanceObject> = mapData.get("distances")

  mapDistances.forEach((distanceObject: DistanceObject) => {
    landmarksStore.distances.push(Distance.fromJSON(distanceObject))
  })
}


</script>

<template>
  <div>
    <Dialog>
      <Menubar class="border-none z-100 h-10">

        <MenubarMenu>
          <MenubarTrigger class="relative">
            File
          </MenubarTrigger>
          <MenubarContent>
            <MenubarLabel>
              Landmarks
            </MenubarLabel>
            <DialogTrigger asChild>
              <MenubarItem inset>Import</MenubarItem>
            </DialogTrigger>
            <MenubarSub>
              <MenubarSubTrigger inset>Export</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem @select="downloadCsv">
                  CSV
                </MenubarItem>
                <MenubarItem @select="downloadJSON">
                  JSON
                </MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem disabled>
              Undo <MenubarShortcut>⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled>
              Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>
            Settings
          </MenubarTrigger>
          <MenubarContent>
            <MenubarLabel inset>
              <div class="flex flex-row justify-between h-full w-full"><span>Dark Mode :</span>
                <Switch :model-value="isDark" @update:model-value="toggleDark" class="inline-block align-middle ml-auto">
                </Switch>
              </div>
            </MenubarLabel>
            <MenubarLabel inset>
              <div class="flex flex-row justify-between h-full w-full"><span>Reverse Mode :</span>
                <Switch :model-value="settingsStore.isLeft" @update:model-value="settingsStore.useToggleLeft"
                  class="inline-block align-middle self-end"></Switch>
              </div>
            </MenubarLabel>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add the landmark file</DialogTitle>
          <DialogDescription>Add the json files containing the landmarks</DialogDescription>
        </DialogHeader>
        <form @submit="onSubmit">
          <Label>File</Label>
          <Input type="file" placeholder="your landmark json file" />
          <DialogFooter>
            <DialogClose as-child>
              <Button type="submit">Confirm</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

  </div>
</template>