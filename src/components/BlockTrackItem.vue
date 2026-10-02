<template>
    <div class="az-track">
        <span class="az-track__number">
            {{ String(track.position).padStart(2, '0') }}
        </span>

        <span class="az-track__title">
            {{ track.title }}
        </span>
    </div>
</template>

<script lang="ts" setup>
import type { Track } from '@/types/musicAlbumFinder'

defineProps<{
    track: Track
}>()
</script>

<style lang="scss" scoped>
.az-track {
    display: flex;
    align-items: flex-start;
    font-size: 20px;
    line-height: 1.5em;
    color: $color-milk-100;

    &__number {
        width: 32px;
        flex-shrink: 0;
        color: #CFCFC9;
    }

    &__title {
        min-width: 0;
        flex: 1;
        overflow-wrap: anywhere;
    }
}
</style>