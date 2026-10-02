<template>
    <BlockModal
        :model-value="modelValue"
        title="Album details"
        @update:model-value="emit('update:modelValue', $event)"
    >
        <div class="az-result-details">
            <div class="az-result-details__start">
                <BlockCover
                    :cover="album.image"
                    :cover-color="album.coverColor"
                    :size="320"
                    variant="cover"
                />

                <BlockArtist
                    :avatar="album.artistAvatar"
                    :name="album.artist"
                    :type="album.artistType"
                />
            </div>

            <div class="az-result-details__end">
                <div class="az-result-details__type">
                    {{ album.type }}<template v-if="album.year"> &bull; {{ album.year }}</template>
                </div>

                <h2 class="az-result-details__title">
                    {{ album.title }}
                </h2>

                <BlockTrackList
                    :error="error"
                    :loading="loading"
                    :tracks="tracks"
                    @retry="emit('retry')"
                />
            </div>
        </div>
    </BlockModal>
</template>

<script lang="ts" setup>
import BlockArtist from '@/components/BlockArtist.vue'
import BlockCover from '@/components/BlockCover.vue'
import BlockModal from '@/components/BlockModal.vue'
import BlockTrackList from '@/components/BlockTrackList.vue'

import type { Album, Track } from '@/types/musicAlbumFinder'

defineProps<{
    album: Album
    error: string | null
    loading: boolean
    modelValue: boolean
    tracks: Track[]
}>()

const emit = defineEmits<{
    (event: 'retry'): void
    (event: 'update:modelValue', value: boolean): void
}>()
</script>

<style lang="scss" scoped>
.az-result-details {
    width: 100%;
    padding: 36px;
    display: flex;
    gap: 48px;

    @media (max-width: 767px) {
        padding: 24px;
        flex-direction: column;
        gap: 0;

        :deep(.az-track-list) {
            overflow: visible;
            flex: none;
            order: 4;
        }
    }

    &__start {
        width: 320px;
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        gap: 36px;

        @media (max-width: 767px) {
            width: 100%;
            margin-block-end: 24px;
            order: 3;

            :deep(.az-cover) {
                margin-inline: auto;
            }
        }

        @media (max-width: 480px) {
            :deep(.az-cover) {
                width: min(320px, 100%);
                height: auto;
                aspect-ratio: 1;
            }
        }
    }

    &__end {
        min-width: 0;
        display: flex;
        flex: 1;
        flex-direction: column;

        @media (max-width: 767px) {
            display: contents;
        }
    }

    &__type {
        font-size: 12px;
        line-height: 1em;
        color: $color-milk-500;
        text-transform: uppercase;

        @media (max-width: 767px) {
            order: 1;
        }
    }

    &__title {
        margin-block-end: 12px;
        font-size: 36px;
        line-height: 1.25em;
        color: $color-milk-100;
        text-transform: uppercase;
        overflow-wrap: anywhere;

        &:before {
            content: '';
            width: 38px;
            height: 26px;
            float: right;

            @media (max-width: 767px) {
                width: 44px;
                height: 32px;
            }
        }

        @media (max-width: 767px) {
            order: 2;
        }

        @media (max-width: 480px) {
            font-size: 24px;
        }
    }
}
</style>