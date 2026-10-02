<template>
    <div
        class="az-result-card"
        role="button"
        tabindex="0"
        @click="emit('select')"
        @keydown="onKeyDown"
        @keydown.space.prevent="emit('select')"
    >
        <BlockCover
            :cover="item.image"
            :cover-color="item.coverColor"
            :vinyl-colors="item.vinylColors"
            variant="vinyl"
            @loaded="onCoverLoaded"
        />

        <div class="az-result-card__details">
            <span class="az-result-card__title">
                {{ item.title }}
            </span>

            <span class="az-result-card__type">
                {{ item.type }}<template v-if="item.year"> &bull; {{ item.year }}</template>
            </span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import BlockCover from '@/components/BlockCover.vue'

import type { Album } from '@/types/musicAlbumFinder'

defineProps<{
    item: Album
}>()

const emit = defineEmits<{
    (event: 'select'): void
    (event: 'vinyl-loaded', image: HTMLImageElement): void
}>()

const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' && !event.code.endsWith('Enter')) {
        return
    }

    event.preventDefault()
    emit('select')
}

const onCoverLoaded = (image: HTMLImageElement) => {
    emit('vinyl-loaded', image)
}
</script>

<style lang="scss" scoped>
.az-result-card {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 24px;
    cursor: pointer;
    text-align: center;

    @media (min-width: 481px) and (max-width: 767px) {
        padding-inline-end: 6px;

        .az-result-card__details {
            margin-inline-end: -6px;
        }
    }

    &:hover {
        .az-result-card__title {
            color: $color-grey-400;
            text-shadow: 1px 1px $color-grey-200;
        }
    }

    &:focus-visible {
        @include focus-ring($color-grey-400, true);
    }

    &__details {
        display: flex;
        flex-direction: column;
        gap: 8px;
        text-transform: uppercase;
    }

    &__title {
        display: block;
        font-size: 15px;
        line-height: 1.25em;
        color: $color-milk-100;
        overflow-wrap: anywhere;
    }

    &__type {
        font-size: 12px;
        line-height: 1em;
        color: $color-milk-500;
    }
}
</style>
