<template>
    <div
        aria-label="Loading"
        class="az-loader-rings"
        role="status"
        :style="{ '--size': `${size}px` }"
    >
        <span class="az-loader-rings__ring az-loader-rings__ring--one" />
        <span class="az-loader-rings__ring az-loader-rings__ring--two" />
        <span class="az-loader-rings__ring az-loader-rings__ring--three" />
    </div>
</template>

<script lang="ts" setup>
interface LoaderRingProps {
    size?: number
}

withDefaults(defineProps<LoaderRingProps>(), {
    size: 48
})
</script>

<style lang="scss" scoped>
.az-loader-rings {
    --size: 48px;

    position: relative;
    width: var(--size);
    height: var(--size);

    &__ring {
        position: absolute;
        top: 50%;
        left: 50%;
        opacity: 0;
        width: 0;
        height: 0;
        border-radius: 50%;
        border: calc(var(--size) * .06) solid;
        transform: translate(-50%, -50%);
        animation: az-loader-rings-grow 2.4s ease-in-out infinite;

        &--one {
            border-color: $color-mint-200;
            animation-delay: 0s;
        }

        &--two {
            border-color: $color-rose-200;
            animation-delay: .8s;
        }

        &--three {
            border-color: $color-navy-200;
            animation-delay: 1.6s;
        }
    }
}

@keyframes az-loader-rings-grow {
    0% {
        opacity: 0;
        width: 0;
        height: 0;
    }

    20% {
        opacity: 1;
    }

    60% {
        opacity: .4;
        width: var(--size);
        height: var(--size);
    }

    100% {
        opacity: 0;
        width: var(--size);
        height: var(--size);
    }
}
</style>