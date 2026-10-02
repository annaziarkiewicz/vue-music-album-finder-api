export type ArtistType = 'Group' | 'Person' | null
export type CoverColor = 'mint' | 'navy' | 'rose'

export interface MusicBrainzArtistAliasApi {
    name: string
}

export interface MusicBrainzArtistApi {
    aliases?: MusicBrainzArtistAliasApi[]
    id: string
    name: string
    score?: number
    type?: string
}

export interface MusicBrainzArtistSearchApi {
    artists?: MusicBrainzArtistApi[]
}

export interface MusicBrainzRecordingApi {
    id: string
    title: string
}

export interface MusicBrainzRecordingsApi {
    recordings: MusicBrainzRecordingApi[]
}

export interface MusicBrainzReleaseApi {
    id: string
}

export interface MusicBrainzReleaseGroupApi {
    id: string
    title: string
    'first-release-date'?: string
    'primary-type': string
}

export interface MusicBrainzReleaseGroupsApi {
    'release-groups': MusicBrainzReleaseGroupApi[]
}

export interface MusicBrainzReleasesApi {
    releases?: MusicBrainzReleaseApi[]
}

export interface WikipediaPageApi {
    thumbnail?: {
        source: string
    }
}

export interface WikipediaSearchApi {
    query?: {
        pages?: Record<string, WikipediaPageApi>
    }
}

export interface Album {
    artist: string
    artistAvatar: string | null
    artistType: ArtistType
    coverColor: CoverColor
    id: string
    image: string | null
    title: string
    type: string
    vinylColors?: [string, string]
    year: number | null
}

export interface Track {
    id: string
    position: number
    title: string
}

export type CoverVariant = 'cover' | 'vinyl'

export type WikipediaAvatarMode = 'exact' | 'search'

export interface WelcomeItem {
    image: string
    name: string
}