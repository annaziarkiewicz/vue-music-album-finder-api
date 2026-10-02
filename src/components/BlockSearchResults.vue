<template>
    <div
        :aria-busy="loading"
        class="az-search-results"
    >
        <BlockLoaderDots v-if="loading" />

        <BlockError
            v-else-if="error"
            :message="error"
        />

        <BlockResultsGrid
            v-else
            :items="items"
            @select="emit('select', $event)"
            @vinyl-loaded="onVinylLoaded"
        />
    </div>
</template>

<script lang="ts" setup>
import BlockError from '@/components/BlockError.vue'
import BlockLoaderDots from '@/components/BlockLoaderDots.vue'
import BlockResultsGrid from '@/components/BlockResultsGrid.vue'

import type { Album } from '@/types/musicAlbumFinder'

defineProps<{
    error: string | null
    items: Album[]
    loading: boolean
}>()

const emit = defineEmits<{
    (event: 'select', item: Album): void
    (event: 'vinyl-loaded', item: Album, image: HTMLImageElement): void
}>()

const onVinylLoaded = (item: Album, image: HTMLImageElement) => {
    emit('vinyl-loaded', item, image)
}
</script>

<style lang="scss" scoped>
.az-search-results {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
}
</style>