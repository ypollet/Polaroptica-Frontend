<script setup lang="ts">
import { useLandmarksStore } from '@/lib/stores';
import { Scale } from '@/lib/utils';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import Label from '../label/Label.vue';

const landmarksStore = useLandmarksStore()
function resetFactor() {
    landmarksStore.adjustFactor = 1
}
</script>

<template>
    <div class="flex row justify-start space-x-1">
        <Label class="flex whitespace-nowrap w-auto items-center">Scale :</Label>
        <Select v-model="landmarksStore.scale" >
            <SelectTrigger class="w-20">
                <SelectValue placeholder="Pick a scale" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Scale</SelectLabel>
                    <SelectItem v-for="scale in Object.keys(Scale).filter((v) => isNaN(Number(v)))" :value="scale">
                        {{ scale }}
                    </SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
        <!--
    <Button variant="secondary" @click="resetFactor">
        Reset Scale
    </Button>
    -->
    </div>
</template>