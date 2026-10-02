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
        background: #9F9F97;
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
        background: $color-mint-200;
    }

    33% {
        background: $color-mint-200;
    }

    34% {
        background: #9F9F97;
    }

    100% {
        background: #9F9F97;
    }
}

@keyframes dotNavy {
    0% {
        background: #9F9F97;
    }

    33% {
        background: #9F9F97;
    }

    34% {
        background: $color-navy-200;
    }

    66% {
        background: $color-navy-200;
    }

    67% {
        background: #9F9F97;
    }

    100% {
        background: #9F9F97;
    }
}

@keyframes dotRose {
    0% {
        background: #9F9F97;
    }

    66% {
        background: #9F9F97;
    }

    67% {
        background: $color-rose-200;
    }

    100% {
        background: $color-rose-200;
    }
}
</style>