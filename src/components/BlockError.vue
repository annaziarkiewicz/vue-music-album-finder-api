<template>
    <div
        class="az-error"
        role="alert"
    >
        <span class="az-error__label">Error:</span>
        {{ errorMessage }}
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
    message: string
}>()

const errorMessage = computed(() => {
    return props.message.replace(/^error:\s*/i, '')
})
</script>

<style lang="scss" scoped>
.az-error {
    width: 100%;
    flex: 1;
    font-size: 20px;
    line-height: 1.5em;
    color: $color-milk-100;

    &__label {
        color: $color-rose-300;
        text-transform: uppercase;
    }
}
</style>