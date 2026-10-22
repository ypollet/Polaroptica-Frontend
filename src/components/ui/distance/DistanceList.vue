<script setup lang="ts">
import { useLandmarksStore } from "@/lib/stores";

import { DistanceIteration } from ".";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { storeToRefs } from "pinia";
import type { Distance } from "@/data/models/distance";
import { PhCircle } from "@phosphor-icons/vue";
import type { AcceptableValue } from "reka-ui";
import { Button } from "../button";

const landmarksStore = useLandmarksStore()

const { selectedDistanceIndex, selectedDistance } = storeToRefs(landmarksStore)

function updateSelectedDist(payload: AcceptableValue) {
    landmarksStore.selectedDistanceIndex = Number(payload)
}
</script>

<template>
    <div class="flex grow w-full flex-col space-y-5">
        <div class="flex space-x-2">
            <Select class="flex grow w-full" :model-value="selectedDistanceIndex.toString()"
            @update:model-value="updateSelectedDist">
            <SelectTrigger class="w-full">
                <!-- Rendered from the store: reka-ui caches each item's text at mount,
                         so its own label goes stale when distances are removed or renamed -->
                <SelectValue>
                    <div class="flex flex-row space-x-2 items-center">
                        <template v-if="selectedDistance">
                            <span class="content-center">{{ selectedDistance.label }}</span>
                        </template>
                        <template v-else>
                            <span class="content-center">New..</span>
                        </template>
                    </div>
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem class="h-8" :value="-1">
                        <div class="flex flex-row space-x-2 items-center">
                            <PhCircle />
                            <span class="content-center">New..</span>
                        </div>
                    </SelectItem>
                    <SelectItem class="h-8" v-for="(distance, index) in landmarksStore.distances" :value="index">
                        <div class="flex flex-row space-x-2 items-center">
                            <PhCircle weight="fill" :color="distance.getColorHEX()" />
                            <span class="content-center">{{ distance.label }}</span>
                        </div>
                    </SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
        <Button variant="secondary" @click="updateSelectedDist('-1')">New..</Button>
        </div>
        <DistanceIteration v-if="landmarksStore.selectedDistance != null" :distance="landmarksStore.selectedDistance"
            :index="landmarksStore.selectedDistanceIndex" :showLandmarks="true" />
        <div
            v-for="(map) in landmarksStore.distances.map((distanceMap, indexMap) => [distanceMap, indexMap] as [Distance, number]).filter((map) => map[1] != landmarksStore.selectedDistanceIndex)">
            <DistanceIteration v-if="map[1] != landmarksStore.selectedDistanceIndex" :distance="map[0]" :index="map[1]"
                :showLandmarks="false" @dblclick="landmarksStore.selectedDistanceIndex = map[1]" />
        </div>
    </div>
</template>