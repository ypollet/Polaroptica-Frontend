<script setup lang="ts">
import { LandmarkList } from "@/components/ui/landmark";
import { DistanceComputed, DistanceList } from "@/components/ui/distance";
import { Slider } from "@/components/ui/slider";
import { CircularSlider } from '@/components/ui/circular-slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useImagesStore, useLandmarksStore } from "@/lib/stores";
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import ThumbnailViewer from "../thumbnail-viewer/ThumbnailViewer.vue";

const imageStore = useImagesStore()
const landmarksStore = useLandmarksStore()

</script>

<template>
  <div class="flex flex-col pb-[12px] w-auto h-full">
    <div class="flex-none space-y-4 py-4">
      <div class="flex justify-center w-[350px]">
        <div class="w-1/2">
          <CircularSlider :modelValue="imageStore.angle"
            @update:modelValue="$event => { if ($event != undefined && imageStore.anglesMap.get($event) != undefined) imageStore.setIndex(imageStore.anglesMap.get($event!)!) }"
            :steps="imageStore.angleRotations" />
        </div>
        <ThumbnailViewer class="flex-shrink w-1/2" />

        <!-- :model-value="[imageStore.index]" :max="imageStore.stackImages.length - 1" :step="1"
          @update:modelValue="$event => imageStore.setIndex($event![0])"-->
      </div>
      <Tabs :model-value="landmarksStore.tab" @update:modelValue="$event => landmarksStore.tab = $event.toString()"
        default-value="landmarks" class="w-full my-4">
        <TabsList class="grid w-full grid-cols-2">
          <TabsTrigger value="landmarks">
            Landmarks
          </TabsTrigger>
          <TabsTrigger value="distances">
            Distances
          </TabsTrigger>
        </TabsList>
        <TabsContent value="landmarks">
          <LandmarkList />
        </TabsContent>
        <TabsContent value="distances">
          <DistanceList />
        </TabsContent>
      </Tabs>
    </div>
    <div class="flex grow items-end mt-4">
      <DistanceComputed />
    </div>
  </div>
</template>

<style>
.scroll-align {
  scroll-snap-align: start;
  scroll-behavior: auto;
}

.scroll-snap-type {
  scroll-snap-type: y mandatory;
}
</style>
