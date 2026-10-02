import { ref } from 'vue'

export const useUrl = () => {
    const skipNextPopstateLoad = ref(false)
    const urlChangeId = ref(0)

    const invalidateUrlChange = () => {
        urlChangeId.value += 1
    }

    const getSearchStateFromUrl = () => {
        const searchParams = new URLSearchParams(window.location.search)

        return searchParams.get('search')?.trim() ?? ''
    }

    const getUrlParamsWithoutAlbum = () => {
        const params = Object.fromEntries(
            new URLSearchParams(window.location.search)
        )

        delete params.album

        return params
    }

    const updateUrl = (
        params: Record<string, string | null>,
        replaceCurrentEntry = false,
        state: Record<string, boolean> = {}
    ) => {
        invalidateUrlChange()

        const url = new URL(window.location.href)

        url.search = ''

        Object.entries(params).forEach(([key, value]) => {
            if (value) {
                url.searchParams.set(key, value)
            }
        })

        if (replaceCurrentEntry) {
            window.history.replaceState(state, '', url)
            return
        }

        window.history.pushState(state, '', url)
    }

    return {
        skipNextPopstateLoad,
        urlChangeId,
        getSearchStateFromUrl,
        getUrlParamsWithoutAlbum,
        invalidateUrlChange,
        updateUrl
    }
}