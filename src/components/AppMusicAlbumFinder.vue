<template>
    <section
        class="az-app"
        :class="{ 'az-app--inside-iframe': isIframe }"
    >
        <BlockSearchBar
            button-label="Search"
            :disabled="loading || (!query.trim() && !searched)"
            :model-value="query"
            placeholder="Search for your favorite artist or band..."
            @search="searchAlbums"
            @update:model-value="updateQuery"
        />

        <BlockWelcomeScreen
            v-if="!searched"
        />

        <BlockSearchResults
            v-else
            :error="error"
            :items="albums"
            :loading="loading"
            @select="openAlbum"
            @vinyl-loaded="updateVinylColors"
        />

        <BlockResultDetails
            v-if="activeAlbum"
            :key="activeAlbum.id"
            :album="activeAlbum"
            :error="detailsError"
            :loading="detailsLoading"
            :model-value="detailsVisible"
            :tracks="tracks"
            @retry="loadAlbumDetails(activeAlbum)"
            @update:model-value="updateDetailsVisibility"
        />
    </section>

    <BlockSplinter :is-iframe="isIframe" />
</template>

<script lang="ts" setup>
import {
    onBeforeUnmount,
    onMounted
} from 'vue'

import { useDetails } from '@/composables/useDetails'
import { useIframeCommunication } from '@/composables/useIframeCommunication'
import { useSearch } from '@/composables/useSearch'
import { useUrl } from '@/composables/useUrl'
import { useVinylColors } from '@/composables/useVinylColors'

import BlockResultDetails from '@/components/BlockResultDetails.vue'
import BlockSearchBar from '@/components/BlockSearchBar.vue'
import BlockSearchResults from '@/components/BlockSearchResults.vue'
import BlockSplinter from '@/components/BlockSplinter.vue'
import BlockWelcomeScreen from '@/components/BlockWelcomeScreen.vue'

import type { Album } from '@/types/musicAlbumFinder'

const { isIframe } = useIframeCommunication()

const {
    albums,
    error,
    loading,
    query,
    searched,
    cancelSearch,
    loadAlbums,
    resetSearch
} = useSearch()

const {
    activeAlbum,
    detailsError,
    detailsLoading,
    detailsVisible,
    tracks,
    loadAlbumDetails,
    resetDetails,
    showAlbumDetails
} = useDetails()

const { getVinylColors } = useVinylColors()

const {
    skipNextPopstateLoad,
    urlChangeId,
    getSearchStateFromUrl,
    getUrlParamsWithoutAlbum,
    invalidateUrlChange,
    updateUrl
} = useUrl()

const resetApplication = () => {
    resetSearch()
    resetDetails()
}

const loadSearchResults = (searchQuery: string) => {
    resetDetails()

    return loadAlbums(searchQuery)
}

const searchAlbums = async () => {
    const searchQuery = query.value.trim()

    if (!searchQuery) {
        query.value = ''

        updateUrl({})
        resetApplication()
        return
    }

    query.value = searchQuery

    updateUrl({
        search: searchQuery
    })

    await loadSearchResults(searchQuery)
}

const updateQuery = (value: string) => {
    invalidateUrlChange()
    cancelSearch()
    query.value = value
}

const openAlbum = async (album: Album) => {
    const params = getUrlParamsWithoutAlbum()

    params.album = album.id

    updateUrl(
        params,
        false,
        {
            albumDetails: true
        }
    )

    await showAlbumDetails(album)
}

const updateDetailsVisibility = (value: boolean) => {
    if (value) {
        detailsVisible.value = true
        return
    }

    if (window.history.state?.albumDetails) {
        skipNextPopstateLoad.value = true
        resetDetails()
        window.history.back()
        return
    }

    updateUrl(getUrlParamsWithoutAlbum(), true)
    resetDetails()
}

const updateVinylColors = (
    album: Album,
    image: HTMLImageElement
) => {
    album.vinylColors = getVinylColors(image)
}

const handleUrlChange = async () => {
    const currentUrlChangeId = ++urlChangeId.value
    const searchParams = new URLSearchParams(window.location.search)
    const albumId = searchParams.get('album')
    const searchQuery = getSearchStateFromUrl()

    query.value = searchQuery

    if (searchQuery) {
        await loadSearchResults(searchQuery)
    } else {
        resetApplication()
    }

    if (currentUrlChangeId !== urlChangeId.value) {
        return
    }

    if (!albumId) {
        resetDetails()
        return
    }

    const album = albums.value.find((item) => {
        return item.id === albumId
    })

    if (!album) {
        resetDetails()
        return
    }

    await showAlbumDetails(album)
}

const handlePopstate = () => {
    if (skipNextPopstateLoad.value) {
        skipNextPopstateLoad.value = false
        return
    }

    handleUrlChange()
}

onMounted(() => {
    window.addEventListener('popstate', handlePopstate)
    handleUrlChange()
})

onBeforeUnmount(() => {
    window.removeEventListener('popstate', handlePopstate)
    cancelSearch()
    resetDetails()
})
</script>

<style lang="scss" scoped>
.az-app {
    position: relative;
    width: 100%;
    max-width: 960px;
    min-height: 680px;
    padding: 136px 36px 24px;
    display: flex;
    flex-direction: column;
    justify-content: stretch;
    gap: 36px;
    background: #B6B6AF;

    @media (max-width: 767px) {
        padding-inline: 24px;
    }

    &:not(.az-app--inside-iframe) {
        margin-block-start: 24px;
    }
}
</style>