'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

type ThemeContextType = {
	theme: Theme
	setTheme: (theme: Theme) => void
}

const ThemeProviderContext = createContext<ThemeContextType | undefined>(
	undefined
)

export function ThemeProvider({
	children,
	defaultTheme = 'system',
	storageKey = 'vite-ui-theme',
	...props
}: {
	children: React.ReactNode
	defaultTheme?: Theme
	storageKey?: string
}) {
	const [theme, setTheme] = useState<Theme>(defaultTheme)
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
		if (typeof window !== 'undefined') {
			const stored = localStorage.getItem(storageKey) as Theme
			if (stored) {
				setTheme(stored)
			}
		}
	}, [storageKey])

	useEffect(() => {
		if (!mounted || typeof window === 'undefined') return

		const root = window.document.documentElement

		root.classList.remove('light', 'dark')

		if (theme === 'system') {
			const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
				.matches
				? 'dark'
				: 'light'

			root.classList.add(systemTheme)
			return
		}

		root.classList.add(theme)
	}, [theme, mounted])

	const value: ThemeContextType = {
		theme,
		setTheme: (newTheme: Theme) => {
			if (typeof window !== 'undefined') {
				localStorage.setItem(storageKey, newTheme)
			}
			setTheme(newTheme)
		},
	}

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
	const context = useContext(ThemeProviderContext)

	if (context === undefined)
		throw new Error('useTheme must be used within a ThemeProvider')

	return context
}
