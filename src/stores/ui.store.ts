import { defineStore } from 'pinia'
import type { ViewMode } from '@/models/poke.ui' // 'grid' | 'table'

const STORAGE_KEY = 'ui:viewMode'

export const useUI = defineStore('ui', {
    state: () => ({
        viewMode: localStorage.getItem(STORAGE_KEY) as ViewMode | null ?? ('grid' as ViewMode),
    }),
    actions: {
        setViewMode(mode: ViewMode) {
            this.viewMode = mode
            if (typeof window !== 'undefined') {
                localStorage.setItem(STORAGE_KEY, mode)
            }
        },
    },
})
