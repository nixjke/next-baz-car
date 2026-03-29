'use client'

import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, ChevronLeft, ChevronRight, Clock3, Route, CarFront } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { getActiveTravelPlaces } from '@/services/travelPlaceService'
import { reachGoalOncePerSession } from '@/lib/metrika'

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

const DagestanAttractions = () => {
  const [page, setPage] = useState(0)
  const [selectedPlace, setSelectedPlace] = useState<TravelPlaceCard | null>(null)
  const [attractionsData, setAttractionsData] = useState<TravelPlaceCard[]>(fallbackAttractionsData)

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
        setPage(0)
      }
    }

    loadPlaces()
  }, [])

  const totalPlaces = attractionsData.length

  const getWrappedIndex = useCallback(
    (index: number) => {
      if (totalPlaces === 0) return 0
      return ((index % totalPlaces) + totalPlaces) % totalPlaces
    },
    [totalPlaces]
  )

  const currentIndex = getWrappedIndex(page)
  const currentAttraction = attractionsData[currentIndex]

  const sideCards = useMemo(() => {
    if (totalPlaces <= 1) return []
    const offsets = totalPlaces > 2 ? [1, 2] : [1]
    return offsets.map((offset) => attractionsData[getWrappedIndex(currentIndex + offset)])
  }, [attractionsData, currentIndex, getWrappedIndex, totalPlaces])

  const changePage = useCallback(
    (step: number) => {
      reachGoalOncePerSession(
        'dagestan_scroll_interaction',
        {
          section: 'dagestan_attractions',
          step,
          current_index: currentIndex + 1,
          total_places: totalPlaces,
        },
        'metrika_once:dagestan_scroll_interaction'
      )
      setPage((prev) => getWrappedIndex(prev + step))
    },
    [currentIndex, getWrappedIndex, totalPlaces]
  )

  const openPlace = useCallback((place: TravelPlaceCard, source: string) => {
    const params = {
      section: 'dagestan_attractions',
      place_id: place.id,
      place_title: place.title,
      source,
    }

    reachGoalOncePerSession(
      'dagestan_card_click',
      params,
      'metrika_once:dagestan_card_click'
    )
    reachGoalOncePerSession(
      'dagestan_place_popup_open',
      params,
      'metrika_once:dagestan_place_popup_open'
    )

    setSelectedPlace(place)
  }, [])

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
      transition: { duration: 0.5, ease: 'easeOut' as const },
    },
  }

  if (!currentAttraction) return null

  return (
    <motion.section
      className="py-8 md:py-10 bg-secondary overflow-hidden relative"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      style={{ '--accent-color': currentAttraction.accentColor } as React.CSSProperties}
    >
      <div
        className="absolute inset-0 transition-colors duration-700 ease-in-out"
        style={{ backgroundColor: 'var(--accent-color)', opacity: 0.1 }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(255,255,255,0.1),transparent_48%),radial-gradient(circle_at_50%_90%,rgba(16,185,129,0.12),transparent_35%)]" />

      <div className="container relative z-10">
        <div className="mb-6 flex flex-col items-center text-center md:mb-8">
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

        <div className="relative mx-auto max-w-5xl">
          <button
            type="button"
            onClick={() => changePage(-1)}
            aria-label="Предыдущая локация"
            className="hidden xl:inline-flex absolute -left-16 top-1/2 z-20 -translate-y-1/2 h-14 w-14 items-center justify-center rounded-full border border-emerald-300/35 bg-slate-950/70 text-emerald-300 shadow-[0_0_26px_rgba(16,185,129,0.18)] backdrop-blur-md transition-colors hover:bg-slate-900/85"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>

          <button
            type="button"
            onClick={() => changePage(1)}
            aria-label="Следующая локация"
            className="hidden xl:inline-flex absolute -right-16 top-1/2 z-20 -translate-y-1/2 h-14 w-14 items-center justify-center rounded-full border border-emerald-300/35 bg-slate-950/70 text-emerald-300 shadow-[0_0_26px_rgba(16,185,129,0.18)] backdrop-blur-md transition-colors hover:bg-slate-900/85"
          >
            <ChevronRight className="h-7 w-7" />
          </button>

          <div className="rounded-3xl border border-emerald-200/15 bg-slate-950/35 p-2.5 md:p-3 shadow-[0_0_0_1px_rgba(74,222,128,0.08),0_18px_55px_rgba(2,6,23,0.5)] backdrop-blur-[3px]">
            <div className="grid gap-3 md:grid-cols-[1.8fr_1fr]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.article
                  key={currentAttraction.id}
                  initial={{ opacity: 0, y: 10, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.985 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  onClick={() => openPlace(currentAttraction, 'main_card')}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border border-emerald-200/20 bg-slate-950/55 shadow-[0_0_18px_rgba(16,185,129,0.1)]"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden md:aspect-[16/10]">
                    <img
                      className="h-full w-full object-cover"
                      alt={currentAttraction.title}
                      src={currentAttraction.imageUrl}
                      draggable="false"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3 md:p-5">
                    <h3 className="text-[1.7rem] font-bold leading-tight text-white md:text-3xl">
                      {currentAttraction.title}
                    </h3>
                    <p className="mt-1.5 max-w-xl text-xs leading-snug text-slate-200/95 line-clamp-3 md:mt-2 md:text-lg md:leading-normal">
                      {currentAttraction.descriptionShort}
                    </p>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        openPlace(currentAttraction, 'main_card_details_button')
                      }}
                      className="mt-2.5 inline-flex items-center rounded-md border border-emerald-300/45 bg-emerald-500/15 px-3.5 py-1.5 text-sm font-semibold text-emerald-200 shadow-[0_0_18px_rgba(16,185,129,0.18)] transition-colors hover:bg-emerald-400/20 md:mt-4 md:px-4 md:py-2"
                    >
                      Подробнее
                    </button>
                  </div>
                </motion.article>
              </AnimatePresence>

              <div className="grid gap-3 md:grid-rows-2">
                {sideCards.map((place) => (
                  <button
                    key={place.id}
                    type="button"
                    onClick={() => openPlace(place, 'side_card')}
                    className="group relative overflow-hidden rounded-2xl border border-emerald-200/20 bg-slate-950/55 text-left shadow-[0_0_16px_rgba(16,185,129,0.08)]"
                  >
                    <div className="aspect-[16/9] w-full overflow-hidden">
                      <img className="h-full w-full object-cover" alt={place.title} src={place.imageUrl} />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-3 md:p-4">
                      <h4 className="text-[1.45rem] font-bold leading-tight text-white md:text-3xl">
                        {place.title}
                      </h4>
                      <p className="mt-1 text-xs leading-snug text-slate-200/90 line-clamp-2 md:text-sm md:leading-normal md:line-clamp-1">
                        {place.descriptionShort}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative mx-auto mt-4 w-fit">
              <div className="absolute inset-x-[-70px] top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-emerald-300/45 to-transparent blur-[1px]" />
              <div className="relative rounded-full border border-emerald-300/30 bg-slate-950/90 px-5 py-1 text-lg font-bold tracking-wide text-white shadow-[0_0_24px_rgba(16,185,129,0.18)]">
                {currentIndex + 1} / {totalPlaces}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-3 xl:hidden">
            <motion.button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-emerald-300/30 bg-slate-950/75 text-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.15)] backdrop-blur-md"
              onClick={() => changePage(-1)}
              aria-label="Предыдущая локация"
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>
            <motion.button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-emerald-300/30 bg-slate-950/75 text-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.15)] backdrop-blur-md"
              onClick={() => changePage(1)}
              aria-label="Следующая локация"
            >
              <ChevronRight className="h-5 w-5" />
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