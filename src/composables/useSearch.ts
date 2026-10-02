import { ref } from 'vue'

import { useMusicBrainz } from '@/composables/useMusicBrainz'

import type {
    Album,
    ArtistType,
    CoverColor,
    MusicBrainzArtistApi,
    MusicBrainzArtistSearchApi,
    MusicBrainzReleaseGroupsApi,
    WikipediaAvatarMode,
    WikipediaSearchApi
} from '@/types/musicAlbumFinder'

const coverColors: CoverColor[] = ['mint', 'navy', 'rose']
const wikipediaLanguages = ['pl', 'en']

const albumTypePriority: Record<string, number> = {
    Album: 0,
    Single: 1,
    EP: 2
}

export const useSearch = () => {
    const albums = ref<Album[]>([])
    const error = ref<string | null>(null)
    const loading = ref(false)
    const query = ref('')
    const searched = ref(false)

    let searchRequestController: AbortController | null = null

    const {
        fetchJson,
        fetchMusicBrainzJson,
        getErrorMessage,
        getYear,
        isAbortError
    } = useMusicBrainz()

    const normalizeArtistName = (name: string) => {
        return name
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim()
    }

    const getArtist = (
        artists: MusicBrainzArtistApi[] | undefined,
        searchQuery: string
    ) => {
        if (!artists?.length) {
            return null
        }

        const normalizedSearchQuery = normalizeArtistName(searchQuery)
        const matchingArtists = artists.filter((artist) => {
            const nameMatches = normalizeArtistName(artist.name)
                === normalizedSearchQuery
            const aliasMatches = artist.aliases?.some((alias) => {
                return normalizeArtistName(alias.name)
                    === normalizedSearchQuery
            })

            return nameMatches || aliasMatches
        })

        return matchingArtists.sort((artistA, artistB) => {
            if (artistA.type === 'Person' && artistB.type !== 'Person') {
                return -1
            }

            if (artistB.type === 'Person' && artistA.type !== 'Person') {
                return 1
            }

            return (artistB.score ?? 0) - (artistA.score ?? 0)
        })[0] ?? null
    }

    const getWikipediaAvatar = async (
        language: string,
        artistName: string,
        mode: WikipediaAvatarMode,
        signal: AbortSignal
    ) => {
        const searchParams = mode === 'exact'
            ? `titles=${encodeURIComponent(artistName)}&redirects=1`
            : `generator=search&gsrsearch=${encodeURIComponent(`"${artistName}"`)}&gsrwhat=title&gsrlimit=1`

        const wikipediaData = await fetchJson<WikipediaSearchApi>(
            `https://${language}.wikipedia.org/w/api.php?action=query&${searchParams}&prop=pageimages&piprop=thumbnail&pithumbsize=96&format=json&origin=*`,
            signal
        )
        const pages = Object.values(wikipediaData.query?.pages ?? {})

        return pages[0]?.thumbnail?.source ?? null
    }

    const getArtistAvatar = async (
        artistName: string,
        signal: AbortSignal
    ) => {
        const modes: WikipediaAvatarMode[] = ['exact', 'search']

        for (const mode of modes) {
            for (const language of wikipediaLanguages) {
                try {
                    const avatar = await getWikipediaAvatar(
                        language,
                        artistName,
                        mode,
                        signal
                    )

                    if (avatar) {
                        return avatar
                    }
                } catch (caughtError) {
                    if (isAbortError(caughtError)) {
                        throw caughtError
                    }
                }
            }
        }

        return null
    }

    const getArtistType = (type?: string): ArtistType => {
        if (type === 'Group' || type === 'Person') {
            return type
        }

        return null
    }

    const getCoverColor = (): CoverColor => {
        return coverColors[Math.floor(Math.random() * coverColors.length)]
    }

    const sortAlbums = (albumA: Album, albumB: Album) => {
        const priorityA = albumTypePriority[albumA.type] ?? 3
        const priorityB = albumTypePriority[albumB.type] ?? 3

        if (priorityA !== priorityB) {
            return priorityA - priorityB
        }

        if (albumA.type !== albumB.type) {
            return albumA.type.localeCompare(albumB.type)
        }

        return (albumB.year ?? 0) - (albumA.year ?? 0)
    }

    const loadAlbums = async (searchQuery: string) => {
        searchRequestController?.abort()

        const requestController = new AbortController()

        searchRequestController = requestController
        albums.value = []
        error.value = null
        loading.value = true
        searched.value = true

        try {
            const artistData = await fetchMusicBrainzJson<MusicBrainzArtistSearchApi>(
                `/artist/?query=${encodeURIComponent(searchQuery)}&fmt=json&limit=100`,
                requestController.signal
            )
            const artist = getArtist(artistData.artists, searchQuery)

            if (!artist) {
                error.value = 'Artist not found.'
                return
            }

            const artistAvatar = await getArtistAvatar(
                artist.name,
                requestController.signal
            )
            const releasesData = await fetchMusicBrainzJson<MusicBrainzReleaseGroupsApi>(
                `/release-group?artist=${artist.id}&fmt=json&limit=100`,
                requestController.signal
            )

            if (searchRequestController !== requestController) {
                return
            }

            albums.value = releasesData['release-groups']
                .map((releaseGroup) => ({
                    artist: artist.name,
                    artistAvatar,
                    artistType: getArtistType(artist.type),
                    coverColor: getCoverColor(),
                    id: releaseGroup.id,
                    image: `https://coverartarchive.org/release-group/${releaseGroup.id}/front-250`,
                    title: releaseGroup.title,
                    type: releaseGroup['primary-type'] || 'Other',
                    year: getYear(releaseGroup['first-release-date'])
                }))
                .sort(sortAlbums)

            if (!albums.value.length) {
                error.value = 'No albums found.'
            }
        } catch (caughtError) {
            if (
                isAbortError(caughtError)
                || searchRequestController !== requestController
            ) {
                return
            }

            error.value = getErrorMessage(caughtError)
        } finally {
            if (searchRequestController === requestController) {
                loading.value = false
                searchRequestController = null
            }
        }
    }

    const cancelSearch = () => {
        searchRequestController?.abort()
        searchRequestController = null
        loading.value = false
    }

    const resetSearch = () => {
        cancelSearch()

        albums.value = []
        error.value = null
        searched.value = false
    }

    return {
        albums,
        error,
        loading,
        query,
        searched,
        cancelSearch,
        loadAlbums,
        resetSearch
    }
}