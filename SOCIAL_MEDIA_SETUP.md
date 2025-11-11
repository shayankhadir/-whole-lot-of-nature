# Instagram & YouTube Integration Setup Guide

## Current Status

✅ **Components Created:**
- InstagramFeed component with real API integration
- YouTubeChannel component with sample data
- Both integrated into homepage

## Instagram Graph API Integration

### What You Need:
1. **Facebook Business Account** (free)
2. **Instagram Business Account** (linked to Facebook)
3. **Meta App** with Instagram Graph API access

### Current Issue:
The credentials provided need to be associated with a valid Instagram Business Account. The API is currently returning "Bad Request" because the app needs to be properly configured.

### Setup Steps:

1. **Create/Verify Instagram Business Account:**
   - Go to instagram.com and switch to a Business Account
   - Link it to your Facebook Page
   - Enable shopping features if needed

2. **Create Meta App:**
   - Visit [developers.facebook.com](https://developers.facebook.com)
   - Create a new app (Choose "Business" type)
   - Add "Instagram Graph API" product
   - Get your App ID and App Secret

3. **Configure API:**
   - In Meta App settings → Basic
   - Copy your App ID and App Secret
   - Update `.env.local` with your credentials
   - Add your Instagram account as a Test User

4. **Get Long-lived Access Token:**
   - Use Meta Graph API Explorer: [graph.instagram.com/me](https://graph.instagram.com/me)
   - Generate token with scopes: `instagram_business_content_read`
   - Or implement token refresh endpoint

### For Now:
The component works with **fallback sample data** if the API fails. This allows your site to display properly while you complete the Instagram setup.

## YouTube Integration

### Setup Steps:

1. **Get YouTube API Key:**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create new project
   - Enable "YouTube Data API v3"
   - Create API key
   - Add to `.env.local`: `YOUTUBE_API_KEY=your_api_key`

2. **Get Channel ID:**
   - Your channel ID can be found in YouTube Studio
   - Or use: `https://www.youtube.com/@yourchannelname` to get it
   - Add to `.env.local`: `YOUTUBE_CHANNEL_ID=your_channel_id`

3. **Create YouTube API Functions:**
   - Add `fetchYouTubeVideos()` to `src/lib/graphql.ts`
   - This will fetch latest videos from your channel

### Sample Implementation:

```typescript
// In src/lib/graphql.ts
export async function fetchYouTubeVideos(limit: number = 4) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet&order=date&maxResults=${limit}&type=video`
  );
  
  const data = await response.json();
  return data.items;
}
```

## Current Implementation

### InstagramFeed Component:
- ✅ Real API integration setup
- ✅ Error handling with fallback sample data
- ✅ Loading states
- ✅ Pink gradient styling
- ✅ Responsive grid layout

### YouTubeChannel Component:
- ✅ Premium styling (red accents)
- ✅ Sample data structure ready
- ✅ Responsive grid
- ✅ Channel stats display
- ⏳ Needs YouTube API integration

## Troubleshooting

**Instagram API Returns 400 Bad Request:**
- Instagram app is not linked to a Business Account
- Check: Instagram Business Account → Settings → Apps and Websites
- Verify app has proper permissions

**No Posts Showing:**
- Business Account has no published posts
- Check privacy settings
- Ensure API has `instagram_business_content_read` scope

**CORS Issues:**
- Use server-side fetching via API route
- Never expose access tokens in client code

## Next Steps

1. Set up Instagram Business Account properly
2. Update env variables with correct credentials
3. Set up YouTube API key and channel ID
4. Implement YouTube data fetching
5. Test both integrations on live site

## Files Modified:
- ✅ `.env.local` - Added Instagram credentials
- ✅ `src/lib/graphql.ts` - Added Instagram API functions
- ✅ `src/components/sections/InstagramFeed.tsx` - Updated with real API integration
- ✅ `src/components/sections/YouTubeChannel.tsx` - Created with sample data
- ✅ `src/app/page.tsx` - Integrated both components into homepage
