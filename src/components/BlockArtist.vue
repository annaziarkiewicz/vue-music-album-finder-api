<template>
    <div class="az-artist">
        <img
            v-if="avatar"
            class="az-artist__avatar"
            alt=""
            :src="avatar"
        >

        <div
            v-else
            class="az-artist__avatar"
        >
            No image
        </div>

        <div class="az-artist__content">
            <span class="az-artist__name">
                {{ name }}
            </span>

            <span class="az-artist__type">
                {{ artistType }}
            </span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
    avatar: string | null
    name: string
    type: string | null
}>()

const artistType = computed(() => {
    return props.type === 'Group' ? 'Band' : 'Artist'
})
</script>

<style lang="scss" scoped>
.az-artist {
    display: flex;
    align-items: center;
    gap: 12px;

    &__avatar {
        width: 48px;
        height: 48px;
        display: flex;
        flex-shrink: 0;
        justify-content: center;
        align-items: center;
        background: #CFCFC9;
        border-radius: 50%;
        object-fit: cover;
        font-size: 9px;
        color: $color-milk-300;
    }

    &__content {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 4px;
        overflow-wrap: anywhere;
    }

    &__name {
        font-size: 20px;
        line-height: 1.25em;
        color: $color-milk-200;
    }

    &__type {
        font-size: 12px;
        line-height: 1em;
        color: $color-milk-500;
        text-transform: uppercase;
    }
}
</style>