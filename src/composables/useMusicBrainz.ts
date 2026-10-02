const musicBrainzApiUrl = 'https://musicbrainz.org/ws/2'
const musicBrainzRequestInterval = 1100

let lastMusicBrainzRequest = 0

export const useMusicBrainz = () => {
    const wait = (duration: number, signal?: AbortSignal) => {
        return new Promise<void>((resolve, reject) => {
            const timeoutId = window.setTimeout(resolve, duration)

            signal?.addEventListener('abort', () => {
                window.clearTimeout(timeoutId)
                reject(new DOMException('The operation was aborted.', 'AbortError'))
            }, {
                once: true
            })
        })
    }

    const fetchJson = async <T>(
        url: string,
        signal?: AbortSignal
    ): Promise<T> => {
        const response = await fetch(url, {
            signal
        })
        const body = await response.json()

        if (!response.ok) {
            throw {
                ...(body && typeof body === 'object' ? body : {}),
                status: response.status
            }
        }

        return body
    }

    const fetchMusicBrainzJson = async <T>(
        path: string,
        signal: AbortSignal
    ): Promise<T> => {
        const elapsed = Date.now() - lastMusicBrainzRequest
        const delay = Math.max(
            0,
            musicBrainzRequestInterval - elapsed
        )

        if (delay) {
            await wait(delay, signal)
        }

        lastMusicBrainzRequest = Date.now()

        try {
            return await fetchJson<T>(
                `${musicBrainzApiUrl}${path}`,
                signal
            )
        } catch (caughtError) {
            if (
                isAbortError(caughtError)
                || !isServiceUnavailableError(caughtError)
            ) {
                throw caughtError
            }

            await wait(musicBrainzRequestInterval, signal)

            lastMusicBrainzRequest = Date.now()

            return fetchJson<T>(
                `${musicBrainzApiUrl}${path}`,
                signal
            )
        }
    }

    const getErrorMessage = (caughtError: unknown) => {
        if (caughtError instanceof Error) {
            return caughtError.message
        }

        if (caughtError && typeof caughtError === 'object') {
            const errorEntry = Object.entries(caughtError)[0]

            if (errorEntry) {
                const [key, value] = errorEntry

                return `${key}: ${String(value)}`
            }
        }

        return 'Unknown error.'
    }

    const getYear = (date?: string) => {
        if (!date) {
            return null
        }

        const year = Number(date.slice(0, 4))

        return Number.isNaN(year) ? null : year
    }

    const isAbortError = (caughtError: unknown) => {
        return (
            caughtError instanceof Error
            && caughtError.name === 'AbortError'
        )
    }

    const isServiceUnavailableError = (caughtError: unknown) => {
        if (!caughtError || typeof caughtError !== 'object') {
            return false
        }

        const errorObject = caughtError as Record<string, unknown>

        return errorObject.status === 503
            || errorObject.error === 'Service Unavailable'
    }

    return {
        fetchJson,
        fetchMusicBrainzJson,
        getErrorMessage,
        getYear,
        isAbortError
    }
}
