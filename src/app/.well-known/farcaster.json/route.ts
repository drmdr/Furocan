import { NextRequest, NextResponse } from 'next/server'

function withValidProperties(properties: Record<string, undefined | string | string[]>) {
  return Object.fromEntries(
    Object.entries(properties).filter(([_, value]) => (Array.isArray(value) ? value.length > 0 : !!value)),
  )
}

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin
  const baseUrl = process.env.NEXT_PUBLIC_URL || origin

  return NextResponse.json(
    {
      accountAssociation: {
        header: process.env.FARCASTER_HEADER,
        payload: process.env.FARCASTER_PAYLOAD,
        signature: process.env.FARCASTER_SIGNATURE,
      },
      frame: withValidProperties({
        version: '1',
        name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
        subtitle: process.env.NEXT_PUBLIC_APP_SUBTITLE,
        description: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
        iconUrl: `${baseUrl}/icon.svg`,
        splashImageUrl: `${baseUrl}/splash.svg`,
        splashBackgroundColor: process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR || '#4F46E5',
        homeUrl: baseUrl,
        webhookUrl: `${baseUrl}/api/webhook`,
        primaryCategory: process.env.NEXT_PUBLIC_APP_PRIMARY_CATEGORY,
        tags: [],
        heroImageUrl: process.env.NEXT_PUBLIC_APP_HERO_IMAGE,
        tagline: process.env.NEXT_PUBLIC_APP_TAGLINE,
        ogTitle: process.env.NEXT_PUBLIC_APP_OG_TITLE,
        ogDescription: process.env.NEXT_PUBLIC_APP_OG_DESCRIPTION,
        ogImageUrl: process.env.NEXT_PUBLIC_APP_OG_IMAGE,
      }),
      noindex: true,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300',
      },
    },
  )
}

