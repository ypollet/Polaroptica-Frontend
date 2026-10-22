<script setup lang="ts">
import { useLandmarksStore } from "@/lib/stores";

import { Landmark } from "@/data/models/landmark";

import draggable from "vuedraggable"

import { ref } from "vue";

import LandmarkIteration from "./LandmarkIteration.vue";

const landmarksStore = useLandmarksStore()

const scrollSnapType = ref<boolean>(true)


function changeColor(event: Event, landmark: Landmark) {
  let target = event.currentTarget as HTMLButtonElement;
  if (target == null) {
    return;
  }
  landmark.setColorHEX(target.value)
}
function changeLabel(payload: string | number, landmark: Landmark) {
  landmark.setLabel(payload.toString())
}

function removeLandmark(id: string) {
  landmarksStore.landmarks = landmarksStore.landmarks.filter((el) => !el.equals(id))
}



</script>

<template>
  <div ref="landmarksScroll" class="overflow-auto min-h-16 max-h-96 w-full border"
    :class="{ 'scroll-snap-type': scrollSnapType }">
    <draggable ref="landmarksElements" v-model="landmarksStore.landmarks" group="landmarks" item-key="id"
      :force-fallback="true" :animation="150" :scroll="true" :bubbleScroll="true" :handle="'.handle'"
      class="relative w-fit min-w-full" @start="scrollSnapType = false" @end="scrollSnapType = true">
      <template #item="{ element: landmark }: { element: Landmark }">
        <LandmarkIteration :landmark="landmark" @remove="removeLandmark" />
      </template>
    </draggable>
  </div>
</template>