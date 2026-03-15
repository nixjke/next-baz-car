'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence, type Variants, type PanInfo } from 'framer-motion'
import { MapPin, ChevronLeft, ChevronRight, Clock3, Route, CarFront } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { getActiveTravelPlaces } from '@/services/travelPlaceService'

export type TravelPlaceCard = {
  id: string
  title: string
  location: string
  descriptionShort: string
  descriptionFull: string
  imageUrl: string
  accentColor: string
  visitDuration: string
  distanceFromMakhachkalaKm: number
  carRecommendation: string
}

const fallbackAttractionsData: TravelPlaceCard[] = [
  {
    id: 'sulak-canyon',
    title: 'Сулакский каньон',
    location: 'Республика Дагестан',
    descriptionShort: 'Один из самых глубоких каньонов в мире с бирюзовой рекой и панорамными видами.',
    descriptionFull:
      'Сулакский каньон — одно из самых впечатляющих мест Дагестана. Здесь открываются невероятные панорамные виды на бирюзовую реку Сулак и горные скалы.',
    imageUrl: '/attractions/sulaksky-kanyon.webp',
    accentColor: 'hsl(190, 70%, 50%)',
    visitDuration: '2–3 часа',
    distanceFromMakhachkalaKm: 90,
    carRecommendation: 'Лучше ехать на Lixiang',
  },
  {
    id: 'naryn-kala',
    title: 'Дербентская крепость Нарын-Кала',
    location: 'Дербент, Республика Дагестан',
    descriptionShort: 'Древняя цитадель ЮНЕСКО с атмосферой старого Дербента.',
    descriptionFull:
      'Крепость Нарын-Кала — историческое сердце Дербента. Мощные стены, древняя архитектура и вид на Каспий создают уникальную атмосферу.',
    imageUrl: '/attractions/derbent.webp',
    accentColor: 'hsl(30, 70%, 50%)',
    visitDuration: '1.5–2 часа',
    distanceFromMakhachkalaKm: 125,
    carRecommendation: 'Лучше ехать на Lixiang',
  },
  {
    id: 'gamsutl',
    title: 'Аул-призрак Гамсутль',
    location: 'Гунибский район, Республика Дагестан',
    descriptionShort: 'Заброшенное высокогорное село с особой атмосферой.',
    descriptionFull:
      'Гамсутль — уникальный горный аул, который называют «дагестанским Мачу-Пикчу». Здесь особая тишина, каменные улочки и потрясающие виды.',
    imageUrl: '/attractions/gamsutl.webp',
    accentColor: 'hsl(70, 30%, 45%)',
    visitDuration: '3–4 часа',
    distanceFromMakhachkalaKm: 160,
    carRecommendation: 'Лучше ехать на Lixiang',
  },
]

const cardVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.9,
    zIndex: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    zIndex: 1,
    transition: {
      x: { type: 'spring' as const, stiffness: 200, damping: 25 },
      opacity: { duration: 0.4, ease: 'easeOut' as const },
      scale: { duration: 0.4, ease: 'easeOut' as const },
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.9,
    zIndex: 0,
    transition: {
      x: { type: 'spring' as const, stiffness: 200, damping: 25 },
      opacity: { duration: 0.3, ease: 'easeIn' as const },
      scale: { duration: 0.3, ease: 'easeIn' as const },
    },
  }),
}

const DagestanAttractions = () => {
  const [[page, direction], setPage] = useState<[number, number]>([0, 0])
  const [selectedPlace, setSelectedPlace] = useState<TravelPlaceCard | null>(null)
  const [attractionsData, setAttractionsData] = useState<TravelPlaceCard[]>(fallbackAttractionsData)

  const currentAttraction = attractionsData[page]

  useEffect(() => {
    const loadPlaces = async () => {
      const places = await getActiveTravelPlaces()
      if (!places.length) return

      const mapped: TravelPlaceCard[] = places
        .filter((place) =>
          Boolean(
            place?.title &&
            place?.location &&
            place?.description_short &&
            place?.description_full &&
            place?.image_url
          )
        )
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .map((place) => ({
          id: place.slug || String(place.id),
          title: place.title,
          location: place.location,
          descriptionShort: place.description_short,
          descriptionFull: place.description_full,
          imageUrl: place.image_url,
          accentColor: 'hsl(190, 70%, 50%)',
          visitDuration: place.visit_duration,
          distanceFromMakhachkalaKm: place.distance_from_city_km,
          carRecommendation: place.car_recommendation || 'Лучше ехать на Lixiang',
        }))

      if (mapped.length > 0) {
        setAttractionsData(mapped)
        setPage([0, 0])
      }
    }

    loadPlaces()
  }, [])

  const paginate = useCallback((newPage: number, newDirection: number) => {
    setPage([newPage, newDirection])
  }, [])

  const changePage = (newDirection: number) => {
    let newPage = page + newDirection;
    if (newPage < 0) {
      newPage = attractionsData.length - 1
    } else if (newPage >= attractionsData.length) {
      newPage = 0
    }
    paginate(newPage, newDirection)
  }

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50
    const velocityThreshold = 300

    if (Math.abs(info.offset.x) > swipeThreshold || Math.abs(info.velocity.x) > velocityThreshold) {
      if (info.offset.x > 0) {
        changePage(-1)
      } else {
        changePage(1)
      }
    }
  }

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' as const },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" as const }
    }
  };

  return (
    <motion.section 
      className="py-10 md:py-12 bg-secondary overflow-hidden relative"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      style={{ "--accent-color": currentAttraction.accentColor } as React.CSSProperties}
    >
      <div className="absolute inset-0 transition-colors duration-700 ease-in-out" style={{ backgroundColor: "var(--accent-color)", opacity: 0.08 }}></div>
      <div className="container relative z-10">
        <div className="flex flex-col items-center text-center mb-6 md:mb-8">
          <motion.div variants={itemVariants} className="flex items-center text-primary mb-2">
            <MapPin className="h-6 w-6 mr-2" />
            <span className="text-sm font-semibold uppercase tracking-wider">Откройте для себя</span>
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Куда поехать в Дагестане
          </motion.h2>
          <motion.p variants={itemVariants} className="text-muted-foreground max-w-2xl px-2 sm:px-0">
            Исследуйте невероятные красоты и уникальные места Дагестана на автомобилях BazCar.
          </motion.p>
        </div>

        <div className="relative flex flex-col items-center">
          <div className="relative w-full flex justify-center">
            <motion.div 
              className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-20 cursor-pointer p-3 bg-card/80 backdrop-blur-sm rounded-full shadow-xl hover:bg-card transition-colors"
              onClick={() => changePage(-1)}
            >
              <ChevronLeft className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            </motion.div>

            <div className="w-[calc(100%-2rem)] max-w-[370px] sm:max-w-[410px] md:max-w-[430px] relative overflow-hidden">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={page}
                  custom={direction}
                  variants={cardVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.1}
                  onDragEnd={handleDragEnd}
                  className="relative bg-card rounded-2xl shadow-2xl overflow-hidden border border-border/60 cursor-grab active:cursor-grabbing"
                >
                  <div className="w-full aspect-[16/10] sm:aspect-[3/2] overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      alt={currentAttraction.title}
                      src={currentAttraction.imageUrl}
                      draggable="false"
                    />
                  </div>
                  <div className="p-4 sm:p-4.5 md:p-5">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground leading-snug">
                      {currentAttraction.title}
                    </h3>
                    <div className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      {currentAttraction.location}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {currentAttraction.descriptionShort}
                    </p>
                    <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <div className="inline-flex items-center gap-2">
                        <Clock3 className="h-4 w-4 text-primary" />
                        Время посещения: {currentAttraction.visitDuration}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedPlace(currentAttraction)}
                      className="mt-3 inline-flex rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-primary/15"
                    >
                      Подробнее
                    </button>
                    <div className="mt-3 text-xs text-primary font-semibold">
                      {page + 1} / {attractionsData.length}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <motion.div 
              className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-20 cursor-pointer p-3 bg-card/80 backdrop-blur-sm rounded-full shadow-xl hover:bg-card transition-colors"
              onClick={() => changePage(1)}
            >
              <ChevronRight className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            </motion.div>
          </div>

          <div className="mt-4 flex items-center gap-3 md:hidden">
            <motion.button
              type="button"
              className="cursor-pointer p-2.5 bg-card/80 backdrop-blur-sm rounded-full shadow-xl hover:bg-card transition-colors"
              onClick={() => changePage(-1)}
              aria-label="Предыдущая локация"
            >
              <ChevronLeft className="h-5 w-5 text-primary" />
            </motion.button>
            <motion.button
              type="button"
              className="cursor-pointer p-2.5 bg-card/80 backdrop-blur-sm rounded-full shadow-xl hover:bg-card transition-colors"
              onClick={() => changePage(1)}
              aria-label="Следующая локация"
            >
              <ChevronRight className="h-5 w-5 text-primary" />
            </motion.button>
          </div>
        </div>
      </div>

      <Dialog open={Boolean(selectedPlace)} onOpenChange={(open) => !open && setSelectedPlace(null)}>
        <DialogContent className="w-[92vw] max-w-lg p-0 overflow-hidden border-border/70 max-h-[92vh]">
          {selectedPlace && (
            <div className="bg-card">
              <DialogHeader className="px-5 pt-5 pb-2">
                <DialogTitle className="text-2xl font-bold text-foreground leading-tight">
                  {selectedPlace.title}
                </DialogTitle>
              </DialogHeader>
              <div className="px-5 pb-5 space-y-3">
                <div className="h-[42vh] sm:h-[46vh] overflow-hidden rounded-xl border border-border/70 bg-muted/25">
                  <img
                    src={selectedPlace.imageUrl}
                    alt={selectedPlace.title}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="inline-flex items-center gap-1.5 text-base text-muted-foreground">
                  <MapPin className="h-4.5 w-4.5 text-primary" />
                  {selectedPlace.location}
                </div>
                <p className="text-base leading-relaxed text-foreground/90 line-clamp-4">
                  {selectedPlace.descriptionFull}
                </p>
                <div className="space-y-1.5 text-base text-foreground/90">
                  <div className="inline-flex items-center gap-2">
                    <Clock3 className="h-4.5 w-4.5 text-primary" />
                    Время посещения: {selectedPlace.visitDuration}
                  </div>
                  <div className="inline-flex items-center gap-2">
                    <Route className="h-4.5 w-4.5 text-primary" />
                    Расстояние от Махачкалы: ~{selectedPlace.distanceFromMakhachkalaKm} км
                  </div>
                  <div className="inline-flex items-center gap-2">
                    <CarFront className="h-4.5 w-4.5 text-primary" />
                    {selectedPlace.carRecommendation}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.section>
  )
}

export default DagestanAttractions