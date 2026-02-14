'use client';

/**
 * Debug component to check Sanity data loading
 * Add this to any page to see what's happening with Sanity queries
 *
 * Usage:
 * import DebugSanity from '@/components/DebugSanity'
 *
 * function MyPage() {
 *   return (
 *     <>
 *       <DebugSanity />
 *       ... rest of your page
 *     </>
 *   )
 * }
 */

import { useEffect } from 'react';
import { useThoughts, useImmersions, useTrainings } from '@/sanity/lib/queries';

export default function DebugSanity() {
  const { thoughts, isLoading: thoughtsLoading, error: thoughtsError } = useThoughts();
  const { immersions, isLoading: immersionsLoading, error: immersionsError } = useImmersions();
  const { trainings, isLoading: trainingsLoading, error: trainingsError } = useTrainings();

  useEffect(() => {
    console.group('🔍 SANITY DEBUG INFO');

    // Environment variables
    console.log('Environment Variables:', {
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
    });

    // Thoughts
    console.log('Thoughts:', {
      loading: thoughtsLoading,
      error: thoughtsError,
      count: thoughts.length,
      data: thoughts,
    });

    // Immersions
    console.log('Immersions:', {
      loading: immersionsLoading,
      error: immersionsError,
      count: immersions.length,
      data: immersions,
    });

    // Trainings
    console.log('Trainings:', {
      loading: trainingsLoading,
      error: trainingsError,
      count: trainings.length,
      data: trainings,
    });

    console.groupEnd();
  }, [
    thoughts,
    thoughtsLoading,
    thoughtsError,
    immersions,
    immersionsLoading,
    immersionsError,
    trainings,
    trainingsLoading,
    trainingsError,
  ]);

  // Show visual debug info in development only
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs max-w-md z-[9999]">
        <div className="font-bold mb-2">Sanity Debug</div>
        <div className="space-y-1">
          <div>Thoughts: {thoughtsLoading ? '⏳' : thoughtsError ? '❌' : `✅ ${thoughts.length}`}</div>
          <div>Immersions: {immersionsLoading ? '⏳' : immersionsError ? '❌' : `✅ ${immersions.length}`}</div>
          <div>Trainings: {trainingsLoading ? '⏳' : trainingsError ? '❌' : `✅ ${trainings.length}`}</div>
        </div>
        {(thoughtsError || immersionsError || trainingsError) && (
          <div className="mt-2 text-red-400">
            {thoughtsError || immersionsError || trainingsError}
          </div>
        )}
      </div>
    );
  }

  return null;
}
