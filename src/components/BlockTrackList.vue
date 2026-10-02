<template>
    <div
        ref="detailsRef"
        aria-label="Track list"
        class="az-track-list"
        role="region"
        :tabindex="isScrollable ? 0 : undefined"
    >
        <BlockLoaderDots v-if="loading" />

        <div v-else-if="error" class="az-track-list__error">
            <BlockError :message="error" />

            <button
                class="az-track-list__retry"
                type="button"
                @click="emit('retry')"
            >
                Retry
            </button>
        </div>

        <div v-else class="az-track-list__tracks">
            <h3 class="az-track-list__tracks-label">
                Track list:
            </h3>

            <BlockTrackItem
                v-for="track in tracks"
                :key="track.id"
                :track="track"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import {
    nextTick,
    onMounted,
    onUnmounted,
    ref,
    watch
} from 'vue'

import BlockError from '@/components/BlockError.vue'
import BlockLoaderDots from '@/components/BlockLoaderDots.vue'
import BlockTrackItem from '@/components/BlockTrackItem.vue'

import type { Track } from '@/types/musicAlbumFinder'

const props = defineProps<{
    error: string | null
    loading: boolean
    tracks: Track[]
}>()

const emit = defineEmits<{
    (event: 'retry'): void
}>()

const detailsRef = ref<HTMLElement | null>(null)
const isScrollable = ref(false)

const updateScrollable = () => {
    if (!detailsRef.value || window.innerWidth <= 767) {
        isScrollable.value = false
        return
    }

    isScrollable.value = detailsRef.value.scrollHeight > detailsRef.value.clientHeight
}

watch(
    () => [
        props.tracks,
        props.error,
        props.loading
    ],
    async () => {
        await nextTick()
        updateScrollable()
    }
)

onMounted(async () => {
    await nextTick()
    updateScrollable()
    window.addEventListener('resize', updateScrollable)
})

onUnmounted(() => {
    window.removeEventListener('resize', updateScrollable)
})
</script>

<style lang="scss" scoped>
.az-track-list {
    overflow-y: auto;
    padding-block: 8px 4px;
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    gap: 8px;

    &:focus-visible {
        @include focus-ring($color-grey-400, 4px);
    }

    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-track {
        background: $color-grey-200;
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background: $color-milk-200;
        border-radius: 4px;
    }

    &__error {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 24px;
    }

    &__retry {
        padding: 16px 24px;
        background: $color-rose-200;
        border-radius: 8px;
        cursor: pointer;
        font-size: 15px;
        font-weight: 500;
        color: $color-milk-200;
        text-transform: uppercase;
        transition: .25s;

        &:focus-visible {
            @include focus-ring($color-grey-400, 8px);
        }

        &:hover {
            background: $color-rose-300;
        }
    }

    &__tracks {
        width: 100%;
        padding-inline-end: 12px;
        display: flex;
        flex-direction: column;
        gap: 4px;

        @media (max-width: 767px) {
            padding: 0;
        }

        &-label {
            font-size: 12px;
            line-height: 1em;
            color: $color-milk-500;
            text-transform: uppercase;
        }
    }
}
</style>