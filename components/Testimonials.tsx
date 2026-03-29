'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Star, MessageSquare, ChevronRight, ChevronLeft, PlayCircle, Check } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import useEmblaCarousel from 'embla-carousel-react'
import { reachGoalOncePerSession } from '@/lib/metrika'
import { normalizeVideoEmbedUrl } from '@/lib/videoEmbed'
import { getActiveTestimonials, type TestimonialApi } from '@/services/testimonialService'

type Testimonial = {
  id: string
  name: string
  role: string
  content: string
  rating: number
  avatarInitial: string
  videoTitle?: string
  videoUrl?: string
  videoPlaceholder?: string
}

function mapApiToTestimonial(t: TestimonialApi): Testimonial {
  return {
    id: String(t.id),
    name: t.name,
    role: t.role,
    content: t.content,
    rating: t.rating,
    avatarInitial: t.avatar_initial,
    videoTitle: t.video_title,
    videoUrl: normalizeVideoEmbedUrl(t.video_url),
    videoPlaceholder: t.video_placeholder,
  }
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [expandedVideoIds, setExpandedVideoIds] = useState<Record<string, boolean>>({})
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])
  const [isDesktopViewport, setIsDesktopViewport] = useState(false)
  const [desktopVisibleCount, setDesktopVisibleCount] = useState(3)
  const [emblaViewportNode, setEmblaViewportNode] = useState<HTMLDivElement | null>(null)
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    containScroll: 'trimSnaps',
  })

  const handleVideoToggle = (testimonial: Testimonial) => {
    setExpandedVideoIds((prev) => {
      const isOpening = !prev[testimonial.id]

      if (isOpening) {
        reachGoalOncePerSession(
          'testimonials_video_iframe_open',
          {
            section: 'testimonials',
            testimonial_id: testimonial.id,
            testimonial_name: testimonial.name,
            action: 'iframe_visible',
          },
          'metrika_once:testimonials_video_iframe_open'
        )
      }

      return {
        ...prev,
        [testimonial.id]: isOpening,
      }
    })
  }

  const handleVideoPlayClick = (testimonial: Testimonial) => {
    reachGoalOncePerSession(
      'testimonials_video_play_click',
      {
        section: 'testimonials',
        testimonial_id: testimonial.id,
        testimonial_name: testimonial.name,
        action: 'play_click',
      },
      'metrika_once:testimonials_video_play_click'
    )
  }

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    setScrollSnaps(emblaApi.scrollSnapList())
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  const scrollPrev = () => {
    emblaApi?.scrollPrev()
  }

  const scrollNext = () => {
    emblaApi?.scrollNext()
  }

  const scrollTo = (index: number) => {
    emblaApi?.scrollTo(index)
  }

  const setEmblaViewportRef = useCallback(
    (node: HTMLDivElement | null) => {
      emblaRef(node)
      setEmblaViewportNode(node)
    },
    [emblaRef]
  )

  useEffect(() => {
    if (!emblaViewportNode) return

    const gapPx = 24
    const minDesktopCardWidth = 280

    const recalcVisibleCount = () => {
      const width = emblaViewportNode.clientWidth
      const desktop = width >= 768
      setIsDesktopViewport(desktop)

      if (!desktop) return

      const fitCount = Math.floor((width + gapPx) / (minDesktopCardWidth + gapPx))
      const normalized = Math.max(2, Math.min(3, fitCount || 2))
      setDesktopVisibleCount(normalized)
    }

    recalcVisibleCount()
    const observer = new ResizeObserver(recalcVisibleCount)
    observer.observe(emblaViewportNode)

    return () => observer.disconnect()
  }, [emblaViewportNode])

  useEffect(() => {
    getActiveTestimonials().then((data) => setTestimonials(data.map(mapApiToTestimonial)))
  }, [])

  const getDistanceFromActive = (index: number) => {
    const total = testimonials.length
    const raw = Math.abs(index - selectedIndex)
    return Math.min(raw, total - raw)
  }

  const renderCard = (testimonial: Testimonial, cardIndex: number) => {
    const distance = getDistanceFromActive(cardIndex)
    const cardClassName =
      isDesktopViewport
        ? 'opacity-100 scale-100'
        : distance === 0
          ? 'opacity-100 scale-100'
          : distance === 1
            ? 'opacity-65 scale-[0.97]'
            : 'opacity-45 scale-[0.94]'

    return (
      <article
        className={cn(
          'flex min-h-[470px] flex-col rounded-2xl border border-border/70 bg-card/95 px-5 py-6 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-sm transition-all duration-300 dark:shadow-[0_10px_35px_rgba(0,0,0,0.35)] md:min-h-[440px] md:px-7 md:py-7',
          cardClassName
        )}
      >
        <div className="mb-4 flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${
                i < testimonial.rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <p className="mb-6 flex-grow text-base leading-relaxed text-muted-foreground md:text-[17px]">
          <span className="mr-2 font-semibold text-primary/90">“</span>
          {testimonial.content}
          <span className="ml-2 font-semibold text-primary/90">”</span>
        </p>
        <div className="mt-auto flex items-center">
          <Avatar className="mr-3 h-12 w-12 border-2 border-primary/70">
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">{testimonial.avatarInitial}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="text-[1.05rem] font-semibold leading-tight text-foreground">{testimonial.name}</h4>
            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
          </div>
        </div>
        <div className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-border/70 bg-muted/50 px-3 py-1.5 text-xs leading-none text-muted-foreground">
          <Check className="h-3.5 w-3.5 text-primary" />
          Подтверждённый клиент
        </div>

        {testimonial.videoUrl && (
          <div className="mt-4 border-t border-border/70 pt-4">
            <button
              type="button"
              onClick={() => {
                handleVideoPlayClick(testimonial)
                handleVideoToggle(testimonial)
              }}
              className="group flex w-full items-center justify-between rounded-xl border border-border/70 bg-card px-3 py-2.5 text-left transition-colors hover:border-primary/40 hover:bg-primary/5"
              aria-expanded={Boolean(expandedVideoIds[testimonial.id])}
              aria-controls={`testimonial-video-${testimonial.id}`}
            >
              <span className="inline-flex items-center gap-2 text-base font-semibold text-foreground">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
                  <PlayCircle className="h-3.5 w-3.5 text-primary" />
                </span>
                Видео-отзыв
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Смотреть</span>
                <ChevronRight
                  className={cn(
                    'h-4 w-4 text-muted-foreground transition-transform duration-300',
                    expandedVideoIds[testimonial.id] && 'rotate-90 text-primary'
                  )}
                />
              </span>
            </button>

            <div
              id={`testimonial-video-${testimonial.id}`}
              className={cn(
                'grid transition-all duration-300',
                expandedVideoIds[testimonial.id] ? 'mt-3 grid-rows-[1fr]' : 'grid-rows-[0fr]'
              )}
            >
              <div className="overflow-hidden" onClick={() => handleVideoPlayClick(testimonial)}>
                <div className="relative overflow-hidden rounded-xl border border-border bg-muted/30">
                  <div className="mx-auto aspect-[9/16] w-full max-w-[260px]">
                    <iframe
                      className="h-full w-full"
                      src={testimonial.videoUrl}
                      title={testimonial.videoTitle || `Видео-отзыв от ${testimonial.name}`}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                  {testimonial.videoPlaceholder && (
                    <p className="border-t border-border/70 px-3 py-2 text-xs text-muted-foreground">
                      {testimonial.videoPlaceholder}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </article>
    )
  }

  return (
    <section className="bg-secondary py-20">
      <div className="w-full">
        <motion.div
          className="mb-16 px-4 text-center md:px-6 xl:px-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-2 inline-flex items-center text-primary">
            <MessageSquare className="mr-2 h-6 w-6" />
            <span className="text-sm font-semibold uppercase tracking-wider">Отзывы Клиентов</span>
          </div>
          <h2 className="mb-3 text-4xl font-bold text-foreground">Что говорят наши клиенты</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Не верьте нам на слово — узнайте от наших довольных клиентов об их опыте работы с BazCar.
          </p>
        </motion.div>

        <div className="mb-5 hidden items-center justify-center gap-2 px-4 md:flex md:px-6 xl:px-10">
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Предыдущий отзыв"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-card text-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Следующий отзыв"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-card text-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-hidden px-2 md:px-6 xl:px-10" ref={setEmblaViewportRef}>
          <div className="flex items-start touch-pan-y gap-3 md:gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="min-w-0 flex-[0_0_88%] sm:flex-[0_0_72%] md:flex-[0_0_calc((100%-3rem)/3)]"
                style={
                  isDesktopViewport
                    ? { flex: `0 0 calc((100% - ${(desktopVisibleCount - 1) * 24}px) / ${desktopVisibleCount})` }
                    : undefined
                }
              >
                {renderCard(testimonial, index)}
              </div>
            ))}
          </div>
        </div>
        
        {/* скрытый элемент для плавного появления секции */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.25 }}
          className="h-0 w-0 overflow-hidden"
          aria-hidden
        />
      </div>
    </section>
  )
}

export default Testimonials