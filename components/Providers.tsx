'use client'

import { ThemeProvider } from '@/context/ThemeProvider'
import { CartProvider } from '@/context/CartContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Toaster } from '@/components/ui/toaster'

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
			<CartProvider>
				<div className="flex flex-col min-h-screen bg-background">
					<Navbar />
					<main className="flex-grow">{children}</main>
					<Footer />
					<Toaster />
				</div>
			</CartProvider>
		</ThemeProvider>
	)
}

