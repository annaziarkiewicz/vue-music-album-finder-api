<template>
    <div
        class="az-cover"
        :class="`az-cover--${variant}`"
        :style="{
            '--cover-size': `${size}px`,
            '--vinyl-c1': vinylColors?.[0] || '#444444',
            '--vinyl-c2': vinylColors?.[1] || '#222222'
        }"
    >
        <div v-if="loading" class="az-cover__image az-cover__image--loading">
            <BlockLoaderRing
                aria-hidden="true"
                :size="loaderSize"
            />
        </div>

        <img
            v-if="cover && !coverMissing"
            v-show="!loading"
            class="az-cover__image"
            alt=""
            :src="cover"
            crossorigin="anonymous"
            @error="onImageError"
            @load="onImageLoad"
        >

        <div
            v-if="coverMissing"
            class="az-cover__image az-cover__image--empty"
            :class="`az-cover__image--${coverColor}`"
        >
            No cover
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

import BlockLoaderRing from '@/components/BlockLoaderRing.vue'

import type { CoverColor, CoverVariant } from '@/types/musicAlbumFinder'

const props = withDefaults(defineProps<{
    cover: string | null
    coverColor: CoverColor
    size?: number
    variant?: CoverVariant
    vinylColors?: [string, string]
}>(), {
    size: 180,
    variant: 'cover'
})

const emit = defineEmits<{
    (event: 'loaded', image: HTMLImageElement): void
}>()

const coverMissing = ref(!props.cover)
const loading = ref(Boolean(props.cover))
const loaderSize = computed(() => props.variant === 'vinyl' ? 24 : 36)

const onImageError = () => {
    coverMissing.value = true
    loading.value = false
}

const onImageLoad = (event: Event) => {
    loading.value = false
    emit('loaded', event.target as HTMLImageElement)
}
</script>

<style lang="scss" scoped>
.az-cover {
    position: relative;
    z-index: 0;
    width: var(--cover-size);
    height: var(--cover-size);

    &--vinyl {
        width: min(var(--cover-size), calc(100% - 55px));
        height: auto;
        margin: 0 auto;
        aspect-ratio: 1;

        &:after {
            content: '';
            position: absolute;
            top: 50%;
            right: -55px;
            z-index: 1;
            width: 140px;
            height: 140px;
            background:
                repeating-radial-gradient(
                    circle,
                    rgba(0,0,0, .18) 0,
                    rgba(0,0,0, .18) 1px,
                    rgba(255,255,255, .04) 2px,
                    rgba(0,0,0, .18) 3px
                ),
                radial-gradient(
                    circle,
                    #DDDDDD 0%,
                    #DDDDDD 6%,
                    var(--vinyl-c1) 7%,
                    var(--vinyl-c2) 60%,
                    #222222 61%,
                    #101010 100%
                );
            border-radius: 50%;
            transform: translateY(-50%);
        }

        .az-cover__image {
            box-shadow: 0 24px 24px -24px $color-grey-300, 28px 0 24px -28px #101010;

            &--loading {
                background: #CFCFC9;
            }
        }
    }

    &__image {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 3;
        width: 100%;
        height: 100%;
        object-fit: cover;

        &--loading,
        &--empty {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        :not(&--empty) {
            box-shadow: 0 24px 24px -24px $color-grey-300;
        }

        &--loading {
            background: #CFCFC9;
        }

        &--empty {
            box-shadow: 0 24px 24px -24px $color-grey-300;
            font-size: 12px;
            line-height: 1em;
            text-transform: uppercase;
        }

        &--mint {
            background: $color-mint-200;
            color: $color-mint-400;
        }

        &--navy {
            background: $color-navy-200;
            color: $color-navy-400;
        }

        &--rose {
            background: $color-rose-200;
            color: $color-rose-400;
        }
    }
}
</style>