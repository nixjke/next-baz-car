'use client'

import { useEffect } from 'react'
import { reachGoal } from '@/lib/metrika'

export function PhoneClickTracker() {
	useEffect(() => {
		const links = document.querySelectorAll<HTMLAnchorElement>('a[href^="tel:"]')
		const handler = () => {
			reachGoal('phone_click')
		}
		links.forEach((el) => el.addEventListener('click', handler))
		return () => {
			links.forEach((el) => el.removeEventListener('click', handler))
		}
	}, [])

	return null
}
