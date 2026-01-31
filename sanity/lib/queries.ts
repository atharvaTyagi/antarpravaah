/**
 * Sanity GROQ Queries
 * 
 * Query functions for fetching thoughts and testimonials from Sanity CMS.
 */

import { client } from './client'
import { urlFor } from './image'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

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
