<template>
    <form
        ref="searchBarRef"
        class="az-search-bar"
        :class="{
            'az-search-bar--input-keyboard-focus': inputKeyboardFocused,
            'az-search-bar--with-prepend': hasPrepend,
            'az-search-bar--with-suggestions': $slots.suggestions
        }"
        @focusout="onFocusOut"
        @submit.prevent="emit('search')"
    >
        <div
            v-if="hasPrepend"
            class="az-search-bar__prepend"
        >
            <slot name="prepend" />
        </div>

        <div
            class="az-search-bar__content"
            :class="{
                'az-search-bar__content--input-keyboard-focus':
                    hasPrepend && inputKeyboardFocused
            }"
        >
            <input
                ref="searchInputRef"
                :aria-autocomplete="suggestionsEnabled ? 'list' : undefined"
                :aria-controls="suggestionsEnabled && $slots.suggestions ? suggestionsId : undefined"
                :aria-expanded="suggestionsEnabled ? !!$slots.suggestions : undefined"
                :aria-haspopup="suggestionsEnabled ? 'listbox' : undefined"
                :aria-label="placeholder"
                class="az-search-bar__input"
                name="search"
                :placeholder="placeholder"
                :role="suggestionsEnabled ? 'combobox' : undefined"
                type="text"
                :value="modelValue"
                @blur="onInputBlur"
                @focus="onInputFocus"
                @input="updateValue"
                @keydown="onInputKeyDown"
            >

            <BlockLoaderRing
                v-if="loading"
                class="az-search-bar__loader"
                :size="32"
            />

            <button
                class="az-search-bar__button"
                :disabled="disabled"
                type="submit"
            >
                {{ buttonLabel }}
            </button>

            <div
                v-if="$slots.suggestions"
                class="az-search-bar__suggestions"
                :class="{
                    'az-search-bar__suggestions--with-prepend': hasPrepend
                }"
            >
                <slot
                    name="suggestions"
                    :suggestions-id="suggestionsId"
                    :with-select="hasPrepend"
                />
            </div>
        </div>
    </form>
</template>

<script lang="ts" setup>
import {
    computed,
    onBeforeUnmount,
    onMounted,
    ref,
    useSlots
} from 'vue'

import BlockLoaderRing from '@/components/BlockLoaderRing.vue'

withDefaults(defineProps<{
    buttonLabel?: string
    disabled?: boolean
    loading?: boolean
    modelValue?: string
    placeholder: string
    suggestionsEnabled?: boolean
    suggestionsId?: string
}>(), {
    buttonLabel: 'Search',
    disabled: false,
    loading: false,
    modelValue: '',
    suggestionsEnabled: false,
    suggestionsId: 'az-search-bar-suggestions-listbox'
})

const emit = defineEmits<{
    (event: 'close-suggestions'): void
    (event: 'search'): void
    (event: 'update:modelValue', value: string): void
}>()

const slots = useSlots()

const inputKeyboardFocused = ref(false)
const keyboardNavigation = ref(false)
const searchBarRef = ref<HTMLFormElement | null>(null)
const searchInputRef = ref<HTMLInputElement | null>(null)

const hasPrepend = computed(() => {
    return Boolean(slots.prepend)
})

const updateValue = (event: Event) => {
    emit('update:modelValue', (event.target as HTMLInputElement).value)
}

const focusInput = () => {
    searchInputRef.value?.focus()
}

defineExpose({
    focusInput
})

const getSuggestionOptions = () => {
    return Array.from(
        searchBarRef.value?.querySelectorAll<HTMLElement>(
            '.az-search-bar__suggestions [role="option"]:not([aria-disabled="true"])'
        ) ?? []
    )
}

const onInputKeyDown = (event: KeyboardEvent) => {
    if (!slots.suggestions) {
        return
    }

    if (event.key === 'Escape') {
        event.preventDefault()
        emit('close-suggestions')
        return
    }

    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
        return
    }

    const options = getSuggestionOptions()

    if (!options.length) {
        return
    }

    event.preventDefault()

    const optionIndex = event.key === 'ArrowDown'
        ? 0
        : options.length - 1

    options[optionIndex]?.focus()
}

const onFocusOut = (event: FocusEvent) => {
    const nextTarget = event.relatedTarget

    if (
        nextTarget instanceof Node
        && searchBarRef.value?.contains(nextTarget)
    ) {
        return
    }

    emit('close-suggestions')
}

const onInputBlur = () => {
    inputKeyboardFocused.value = false
}

const onInputFocus = () => {
    inputKeyboardFocused.value = keyboardNavigation.value
}

const onFocusOrigin = (event: Event) => {
    const openedBy = (event as CustomEvent<unknown>).detail

    if (openedBy !== 'keyboard' && openedBy !== 'mouse') {
        return
    }

    keyboardNavigation.value = openedBy === 'keyboard'

    if (document.activeElement === searchInputRef.value) {
        inputKeyboardFocused.value = keyboardNavigation.value
    }
}

const onKeyDown = () => {
    keyboardNavigation.value = true
}

const onPointerDown = () => {
    keyboardNavigation.value = false
}

onMounted(() => {
    searchInputRef.value?.addEventListener('ad2m:focus-origin', onFocusOrigin)
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
})

onBeforeUnmount(() => {
    searchInputRef.value?.removeEventListener('ad2m:focus-origin', onFocusOrigin)
    document.removeEventListener('keydown', onKeyDown)
    document.removeEventListener('pointerdown', onPointerDown)
})
</script>

<style lang="scss" scoped>
.az-search-bar {
    position: absolute;
    top: 24px;
    left: 36px;
    right: 36px;
    z-index: 1;
    padding: 8px 12px 8px 16px;
    display: flex;
    align-items: center;
    background: #B6B6AF;
    border-radius: 38px;
    border: 4px solid $color-milk-200;

    @media (max-width: 767px) {
        left: 24px;
        right: 24px;
    }

    @media (max-width: 480px) {
        padding-block: 0;
        flex-wrap: wrap;
    }

    &--input-keyboard-focus {
        &:not(.az-search-bar--with-prepend) {
            border-color: $color-grey-400;
        }
    }

    &--with-suggestions {
        &:not(.az-search-bar--with-prepend) {
            overflow: hidden;
            box-shadow: 0 0 48px -24px $color-grey-300;

            .az-search-bar__content {
                flex-wrap: wrap;
            }
        }

        .az-search-bar__content--input-keyboard-focus:before {
            border-radius: 0 34px 0 0;

            @media (max-width: 480px) {
                border-radius: 0;
            }
        }
    }

    &__prepend {
        flex: 0 0 auto;

        @media (max-width: 480px) {
            position: relative;
            width: 100%;
            padding-block: 8px;
            flex-basis: 100%;

            &:after {
                content: '';
                position: absolute;
                bottom: 0;
                left: -16px;
                right: -12px;
                height: 4px;
                background: $color-milk-200;
            }
        }
    }

    &__content {
        position: relative;
        min-width: 0;
        display: flex;
        flex: 1;
        align-items: center;
        align-self: stretch;

        @media (max-width: 480px) {
            width: 100%;
            padding-block: 8px;
            flex-basis: 100%;
        }

        &--input-keyboard-focus:before {
            content: '';
            position: absolute;
            top: -8px;
            bottom: -8px;
            left: -8px;
            right: -12px;
            z-index: 3;
            box-shadow: 0 0 0 4px $color-grey-400;
            border-radius: 0 34px 34px 0;
            pointer-events: none;

            @media (max-width: 480px) {
                top: 0;
                bottom: 0;
                left: -16px;
                right: -12px;
                border-radius: 0 0 34px 34px;
            }
        }
    }

    &__input {
        position: relative;
        z-index: 2;
        min-width: 0;
        height: 52px;
        padding-inline: 16px;
        flex: 1;
        font-size: 24px;
        line-height: 1em;

        @media (max-width: 480px) {
            padding-inline-start: 12px;
        }

        &::placeholder {
            color: #CFCFC9;
        }

        &:-webkit-autofill,
        &:-webkit-autofill:hover,
        &:-webkit-autofill:focus,
        &:-webkit-autofill:active {
            box-shadow: 0 0 0 1000px #B6B6AF inset;
            -webkit-text-fill-color: $color-milk-100;
            caret-color: $color-milk-100;
        }
    }

    &__button {
        position: relative;
        z-index: 2;
        padding: 14.5px 16px;
        background: $color-milk-200;
        border-radius: 22px;
        font-size: 15px;
        font-weight: 500;
        line-height: 1em;
        color: $color-milk-400;
        text-transform: uppercase;
        transition: .25s;

        &:focus-visible {
            @include focus-ring($color-grey-400, 22px);
        }

        &:hover:not(:disabled) {
            background: $color-milk-100;
        }

        &:disabled {
            background: $color-grey-200;
            cursor: not-allowed;
        }
    }

    &__loader {
        margin-inline-end: 12px;
        flex: 0 0 auto;
    }

    &__suggestions {
        width: calc(100% + 28px);
        margin: 8px -12px 0 -16px;
        flex: 0 0 calc(100% + 28px);

        &--with-prepend {
            position: absolute;
            top: -12px;
            left: -12px;
            right: -16px;
            z-index: 1;
            overflow: hidden;
            width: auto;
            margin: 0;
            padding-block-start: 70px;
            background: #B6B6AF;
            box-shadow: 0 0 48px -24px $color-grey-300;
            border-radius: 0 38px 38px 38px;
            border: 4px solid $color-milk-200;

            @media (max-width: 480px) {
                top: -4px;
                left: -20px;
                right: -16px;
                padding-block-start: 68px;
                border-radius: 0 0 34px 34px;
            }
        }
    }
}
</style>