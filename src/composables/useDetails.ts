import { ref } from 'vue'

import { useMusicBrainz } from '@/composables/useMusicBrainz'

import type {
    Album,
    MusicBrainzRecordingsApi,
    MusicBrainzReleasesApi,
    Track
} from '@/types/musicAlbumFinder'

export const useDetails = () => {
    const activeAlbum = ref<Album | null>(null)
    const detailsError = ref<string | null>(null)
    const detailsLoading = ref(false)
    const detailsVisible = ref(false)
    const tracks = ref<Track[]>([])

    let detailsRequestController: AbortController | null = null

    const {
        fetchMusicBrainzJson,
        getErrorMessage,
        isAbortError
    } = useMusicBrainz()

    const resetDetails = () => {
        detailsRequestController?.abort()
        detailsRequestController = null

        activeAlbum.value = null
        detailsError.value = null
        detailsLoading.value = false
        detailsVisible.value = false
        tracks.value = []
    }

    const loadAlbumDetails = async (album: Album) => {
        detailsRequestController?.abort()

        const requestController = new AbortController()

        detailsRequestController = requestController
        detailsError.value = null
        detailsLoading.value = true
        tracks.value = []

        try {
            const releasesData = await fetchMusicBrainzJson<MusicBrainzReleasesApi>(
                `/release?release-group=${album.id}&fmt=json`,
                requestController.signal
            )
            const releaseId = releasesData.releases?.[0]?.id

            if (!releaseId) {
                detailsError.value = 'Track list not found.'
                return
            }

            const recordingsData = await fetchMusicBrainzJson<MusicBrainzRecordingsApi>(
                `/recording?release=${releaseId}&fmt=json&limit=100`,
                requestController.signal
            )

            if (detailsRequestController !== requestController) {
                return
            }

            tracks.value = recordingsData.recordings.map((recording, index) => ({
                id: recording.id,
                position: index + 1,
                title: recording.title
            }))
        } catch (caughtError) {
            if (
                isAbortError(caughtError)
                || detailsRequestController !== requestController
            ) {
                return
            }

            detailsError.value = getErrorMessage(caughtError)
        } finally {
            if (detailsRequestController === requestController) {
                detailsLoading.value = false
                detailsRequestController = null
            }
        }
    }

    const showAlbumDetails = async (album: Album) => {
        activeAlbum.value = album
        detailsVisible.value = true

        await loadAlbumDetails(album)
    }

    return {
        activeAlbum,
        detailsError,
        detailsLoading,
        detailsVisible,
        tracks,
        loadAlbumDetails,
        resetDetails,
        showAlbumDetails
    }
}
