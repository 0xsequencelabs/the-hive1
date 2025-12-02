'use client'

import posthog from 'posthog-js'

import { PostHogProvider as PHProvider } from 'posthog-js/react'
import React from 'react';

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY

if (typeof window !== 'undefined' && posthogKey) {
  posthog.init(posthogKey, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
  })
} else if (typeof window !== 'undefined') {
  console.warn('[PostHog] Skipping initialization: NEXT_PUBLIC_POSTHOG_KEY is not set')
}

interface Props {
    children: React.ReactNode;
}

export const PostHogProvider: React.FC<Props> = ({ children }) => {
    return (
        <PHProvider 
            client={posthog}
        >
            {children}
        </PHProvider>
    )
}