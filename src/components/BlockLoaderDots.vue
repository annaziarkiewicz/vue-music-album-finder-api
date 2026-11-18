<template>
    <div
        aria-label="Loading"
        class="az-loader-dots"
        role="status"
    >
        <span class="az-loader-dots__dot az-loader-dots__dot--mint" />
        <span class="az-loader-dots__dot az-loader-dots__dot--navy" />
        <span class="az-loader-dots__dot az-loader-dots__dot--rose" />
    </div>
</template>

<style lang="scss" scoped>
.az-loader-dots {
    display: flex;
    align-items: center;
    gap: 8px;

    &__dot {
        width: 16px;
        height: 16px;
        background: $color-sand-300;
        border-radius: 50%;
        animation-duration: 1.8s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;

        &--mint {
            animation-name: dotMint;
        }

        &--navy {
            animation-name: dotNavy;
        }

        &--rose {
            animation-name: dotRose;
        }
    }
}

@keyframes dotMint {
    0% {
        background: $color-mint-100;
    }

    33% {
        background: $color-mint-100;
    }

    34% {
        background: $color-sand-300;
    }

    100% {
        background: $color-sand-300;
    }
}

@keyframes dotNavy {
    0% {
        background: $color-sand-300;
    }

    33% {
        background: $color-sand-300;
    }

    34% {
        background: $color-navy-100;
    }

    66% {
        background: $color-navy-100;
    }

    67% {
        background: $color-sand-300;
    }

    100% {
        background: $color-sand-300;
    }
}

@keyframes dotRose {
    0% {
        background: $color-sand-300;
    }

    66% {
        background: $color-sand-300;
    }

    67% {
        background: $color-rose-100;
    }

    100% {
        background: $color-rose-100;
    }
}
</style>