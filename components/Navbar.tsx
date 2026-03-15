'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import { Menu, Phone, Sun, Moon, ShoppingCart, MessageCircle } from 'lucide-react'
import { useTheme } from '@/context/ThemeProvider'
import { useCart } from '@/context/CartContext'
import { USE_CART } from '@/config/featureFlags'

const navItems = [
  { label: 'Главная', href: '/' },
  { label: 'Автопарк', href: '/cars' },
  { label: 'О Дагестане', href: '/about-dagestan' },
];

const SOCIAL_LINKS = {
	whatsapp: 'https://wa.me/79894413888',
}

const Navbar = () => {
	const [isSheetOpen, setIsSheetOpen] = useState(false)
	const [isScrolled, setIsScrolled] = useState(false)
	const pathname = usePathname()
	const { theme, setTheme } = useTheme()
	const { cartItems } = useCart()
	const cartItemsCount = cartItems.length
	const touchStartRef = useRef(false)

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20)
		}
		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	useEffect(() => {
		setIsSheetOpen(false)
	}, [pathname])

	const toggleTheme = () => {
		setTheme(theme === 'dark' ? 'light' : 'dark')
	}

	const handleThemeToggle = (e: React.MouseEvent | React.TouchEvent) => {
		// Если это click после touchstart, игнорируем
		if (e.type === 'click' && touchStartRef.current) {
			touchStartRef.current = false
			return
		}
		
		e.preventDefault()
		e.stopPropagation()
		toggleTheme()
	}

	const navLinkClasses = (href: string) =>
		`relative font-medium pb-1.5 transition-colors duration-200 ease-out hover:text-primary ${
			pathname === href
				? 'text-primary after:w-full'
				: 'text-foreground/80 after:w-0 hover:after:w-full'
		} after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300`

	const mobileNavLinkClasses = (href: string) =>
		`block py-3 px-4 text-lg font-medium rounded-md transition-colors duration-200 ease-out ${
			pathname === href
				? 'bg-primary text-primary-foreground'
				: 'text-foreground hover:bg-secondary'
		}`
  
	return (
		<motion.nav
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			transition={{ duration: 0.5, ease: 'easeOut' as const }}
			className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ease-out ${
				isScrolled
					? 'bg-background/95 shadow-lg backdrop-blur-md border-border/50'
					: 'bg-transparent border-transparent'
			}`}
		>
			{isScrolled && (
				<div className="absolute inset-0 bg-background/75 backdrop-blur-md -z-10" />
			)}
			{isScrolled && (
				<div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/20 -z-20" />
			)}
			<div>
      <div className="container flex items-center justify-between h-20">
		<Link
			href="/"
			className="flex items-center gap-2 text-2xl font-bold text-primary"
		>
			<img src="/logo.png" alt="BazCar Logo" className="h-10 w-auto" />
			<span className="hidden sm:inline gradient-text">
				BazCar
			</span>
		</Link>

		<div className="hidden lg:flex items-center space-x-8">
			{navItems.map((item) => (
				<Link
					key={item.label}
					href={item.href}
					className={navLinkClasses(item.href)}
				>
					{item.label}
				</Link>
			))}
		</div>

        <div className="flex items-center gap-3">
          {USE_CART && (
            <Button
              variant="outline"
              size="icon"
              asChild
              className="relative rounded-full"
              aria-label="Корзина"
            >
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount > 9 ? '9+' : cartItemsCount}
                  </span>
                )}
              </Link>
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleThemeToggle}
            onMouseDown={(e) => {
				e.preventDefault()
			}}
            onTouchStart={(e) => {
				touchStartRef.current = true
				handleThemeToggle(e)
				// Сбрасываем флаг через небольшую задержку, чтобы поймать последующий click
				setTimeout(() => {
					touchStartRef.current = false
				}, 300)
			}}
            className="rounded-full"
            aria-label={theme === 'dark' ? 'Переключить на светлую тему' : 'Переключить на темную тему'}
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === 'dark' ? (
                <motion.div
                  key="moon"
                  initial={{ y: -20, opacity: 0, rotate: -90 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: 20, opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="h-5 w-5 text-primary" />
                </motion.div>
              ) : (
                <motion.div
                  key="sun"
                  initial={{ y: -20, opacity: 0, rotate: -90 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: 20, opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="h-5 w-5 text-primary" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>

		<div className="hidden lg:flex items-center gap-4">
			<div className="flex items-center gap-2">
				<a
					href={SOCIAL_LINKS.whatsapp}
					target="_blank"
					rel="noopener noreferrer"
					aria-label="WhatsApp"
					className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-card text-foreground transition-colors hover:text-primary hover:border-primary/50"
				>
					<MessageCircle className="h-4 w-4" />
				</a>
			</div>
			<a
				href="tel:+79894413888"
				className="inline-flex items-center gap-2 text-sm font-semibold text-foreground/90 hover:text-primary transition-colors"
			>
				<Phone className="h-4 w-4 text-primary" />
				+7 989 441-38-88
			</a>
			<Button asChild variant="default" className="group">
				<Link href="/cars">Выбрать автомобиль</Link>
			</Button>
		</div>

          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="icon" className="rounded-full">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Открыть меню</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-sm bg-background p-0">
              <SheetHeader className="p-6 pb-4 border-b border-border">
                <SheetTitle className="flex items-center gap-2 text-2xl font-bold text-primary">
                  <img src="/logo.png" alt="BazCar Logo" className="h-8 w-auto" /> BazCar
                </SheetTitle>
              </SheetHeader>
		<div className="p-6 space-y-3">
			{navItems.map((item) => (
				<Link
					key={item.label}
					href={item.href}
					className={mobileNavLinkClasses(item.href)}
					onClick={() => setIsSheetOpen(false)}
				>
					{item.label}
				</Link>
			))}
			<div className="pt-3 mt-2 border-t border-border/60">
				<div className="flex items-center gap-2">
					<a
						href={SOCIAL_LINKS.whatsapp}
						target="_blank"
						rel="noopener noreferrer"
						aria-label="WhatsApp"
						className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-card text-foreground transition-colors hover:text-primary hover:border-primary/50"
					>
						<MessageCircle className="h-4 w-4" />
					</a>
					<a
						href="tel:+79894413888"
						className="ml-1 text-sm font-medium text-foreground/90 hover:text-primary transition-colors"
					>
						+7 989 441-38-88
					</a>
				</div>
			</div>
			{USE_CART && (
				<Button
					variant="outline"
					size="lg"
					asChild
					className="w-full mt-4 relative"
					onClick={() => setIsSheetOpen(false)}
				>
					<Link href="/cart">
						<ShoppingCart className="mr-2 h-5 w-5" />
						Корзина
						{cartItemsCount > 0 && (
							<span className="ml-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
								{cartItemsCount > 9 ? '9+' : cartItemsCount}
							</span>
						)}
					</Link>
				</Button>
			)}
			<Button asChild size="lg" className="w-full mt-4 group">
				<Link href="/cars" onClick={() => setIsSheetOpen(false)}>
					Выбрать автомобиль
				</Link>
			</Button>
		</div>
            </SheetContent>
          </Sheet>
        </div>
		</div>
		</div>
		</motion.nav>
	)
}

export default Navbar