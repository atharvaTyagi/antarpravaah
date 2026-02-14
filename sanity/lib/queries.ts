/**
 * Sanity GROQ Queries
 * 
 * Query functions for fetching thoughts, testimonials, immersions, and trainings from Sanity CMS.
 */

import { client } from './client'
import { urlFor } from './image'
import type { SanityImageSource } from '@sanity/image-url'

// =============================================================================
// Types
// =============================================================================

export interface SanityThought {
  _id: string
  content: string
  image?: SanityImageSource
  imageUrl?: string
  publishedAt: string
}

export interface SanityTestimonial {
  _id: string
  name: string
  workshop: string
  testimonial: string
  publishedAt: string
}

export interface SanityImmersion {
  _id: string
  title: string
  slug: string
  type: 'immersion' | 'workshop'
  duration: string
  language: string
  prerequisite: string
  format: string
  about: string
  whatToExpect: string[]
  image?: SanityImageSource
  imageUrl?: string
  ctaText: string
  order: number
}

export interface SanityTraining {
  _id: string
  title: string
  slug: string
  duration: string
  prerequisites: string
  format: string
  language: string
  overview: string
  whatYoullLearn: string[]
  ctaText: string
  order: number
}

// =============================================================================
// GROQ Queries
// =============================================================================

const thoughtsQuery = `*[_type == "thought" && published == true] | order(publishedAt desc) {
  _id,
  content,
  image,
  publishedAt
}`

const testimonialsQuery = `*[_type == "testimonial" && published == true] | order(publishedAt desc) {
  _id,
  name,
  workshop,
  testimonial,
  publishedAt
}`

const immersionsQuery = `*[_type == "immersion" && published == true] | order(order asc) {
  _id,
  title,
  "slug": slug.current,
  type,
  duration,
  language,
  prerequisite,
  format,
  about,
  whatToExpect,
  image,
  ctaText,
  order
}`

const trainingsQuery = `*[_type == "training" && published == true] | order(order asc) {
  _id,
  title,
  "slug": slug.current,
  duration,
  prerequisites,
  format,
  language,
  overview,
  whatYoullLearn,
  ctaText,
  order
}`

// =============================================================================
// Query Functions
// =============================================================================

/**
 * Fetch all published thoughts from Sanity
 * Images are optimized with width: 800px, quality: 80
 */
export async function getThoughts(): Promise<SanityThought[]> {
  try {
    const thoughts = await client.fetch<SanityThought[]>(thoughtsQuery)
    
    // Process images to generate optimized URLs
    return thoughts.map((thought) => ({
      ...thought,
      imageUrl: thought.image 
        ? urlFor(thought.image).width(800).quality(80).auto('format').url()
        : undefined,
    }))
  } catch (error) {
    console.error('Error fetching thoughts from Sanity:', error)
    throw new Error('Failed to fetch thoughts')
  }
}

/**
 * Fetch all published testimonials from Sanity
 */
export async function getTestimonials(): Promise<SanityTestimonial[]> {
  try {
    const testimonials = await client.fetch<SanityTestimonial[]>(testimonialsQuery)
    return testimonials
  } catch (error) {
    console.error('Error fetching testimonials from Sanity:', error)
    throw new Error('Failed to fetch testimonials')
  }
}

/**
 * Fetch all published immersions/workshops from Sanity
 * Images are optimized with width: 800px, quality: 85
 */
export async function getImmersions(): Promise<SanityImmersion[]> {
  try {
    const immersions = await client.fetch<SanityImmersion[]>(immersionsQuery)
    
    // Process images to generate optimized URLs
    return immersions.map((immersion) => ({
      ...immersion,
      imageUrl: immersion.image 
        ? urlFor(immersion.image).width(800).quality(85).auto('format').url()
        : undefined,
    }))
  } catch (error) {
    console.error('Error fetching immersions from Sanity:', error)
    throw new Error('Failed to fetch immersions')
  }
}

/**
 * Fetch all published training programs from Sanity
 */
export async function getTrainings(): Promise<SanityTraining[]> {
  try {
    const trainings = await client.fetch<SanityTraining[]>(trainingsQuery)
    return trainings
  } catch (error) {
    console.error('Error fetching trainings from Sanity:', error)
    throw new Error('Failed to fetch trainings')
  }
}

// =============================================================================
// React Hooks (Client-side fetching)
// =============================================================================

import { useState, useEffect, useCallback } from 'react'

interface UseThoughtsResult {
  thoughts: SanityThought[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

interface UseTestimonialsResult {
  testimonials: SanityTestimonial[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * React hook for fetching thoughts client-side
 */
export function useThoughts(): UseThoughtsResult {
  const [thoughts, setThoughts] = useState<SanityThought[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchThoughts = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const data = await getThoughts()
      setThoughts(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load thoughts'
      setError(message)
      console.error('Error in useThoughts:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchThoughts()
  }, [fetchThoughts])

  return { thoughts, isLoading, error, refetch: fetchThoughts }
}

/**
 * React hook for fetching testimonials client-side
 */
export function useTestimonials(): UseTestimonialsResult {
  const [testimonials, setTestimonials] = useState<SanityTestimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTestimonials = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const data = await getTestimonials()
      setTestimonials(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load testimonials'
      setError(message)
      console.error('Error in useTestimonials:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTestimonials()
  }, [fetchTestimonials])

  return { testimonials, isLoading, error, refetch: fetchTestimonials }
}

interface UseImmersionsResult {
  immersions: SanityImmersion[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

interface UseTrainingsResult {
  trainings: SanityTraining[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * React hook for fetching immersions/workshops client-side
 */
export function useImmersions(): UseImmersionsResult {
  const [immersions, setImmersions] = useState<SanityImmersion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchImmersions = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const data = await getImmersions()
      setImmersions(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load immersions'
      setError(message)
      console.error('Error in useImmersions:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchImmersions()
  }, [fetchImmersions])

  return { immersions, isLoading, error, refetch: fetchImmersions }
}

/**
 * React hook for fetching training programs client-side
 */
export function useTrainings(): UseTrainingsResult {
  const [trainings, setTrainings] = useState<SanityTraining[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTrainings = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const data = await getTrainings()
      setTrainings(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load trainings'
      setError(message)
      console.error('Error in useTrainings:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTrainings()
  }, [fetchTrainings])

  return { trainings, isLoading, error, refetch: fetchTrainings }
}
