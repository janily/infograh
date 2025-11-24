# Infographic Generation Implementation

## Overview
This implementation adds infographic generation capabilities to the application using the Unifuncs Web Reader API and GRSAI Nano Banana Pro API.

## Architecture

### Backend Endpoints

#### 1. `/api/fetch-content`
- **Purpose**: Fetches web page content from a URL using Unifuncs API
- **Method**: POST
- **Request Body**:
  ```json
  {
    "url": "string (required)",
    "format": "string (optional, default: 'md')",
    "liteMode": "boolean (optional, default: false)",
    "includeImages": "boolean (optional, default: true)"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "content": "string (markdown/text content)",
    "url": "string (source URL)"
  }
  ```
- **Environment Variable**: `UNIFUNCS_API_KEY`

#### 2. `/api/generate-infographic`
- **Purpose**: Generates infographic from content using GRSAI Nano Banana Pro
- **Method**: POST
- **Request Body**:
  ```json
  {
    "structuralSummary": "string (required)",
    "style": "string (optional, default: 'MODERN_EDITORIAL')",
    "language": "string (optional, default: 'English')",
    "aspectRatio": "string (optional, default: 'auto')",
    "imageSize": "string (optional: '1K'|'2K'|'4K', default: '1K')"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "string (task ID for polling)"
    }
  }
  ```
- **Environment Variable**: `GRSAI_API_KEY`

#### 3. `/api/poll-infographic`
- **Purpose**: Polls for infographic generation results
- **Method**: GET
- **Query Parameters**: `taskId=string`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "status": "running|succeeded|failed",
      "progress": "number (0-100)",
      "results": [
        {
          "url": "string (image URL)",
          "content": "string"
        }
      ],
      "failure_reason": "string (if failed)"
    }
  }
  ```

### Frontend Components

#### 1. InfographicSettingsPanel
- **Location**: `/components/dashboard/InfographicSettingsPanel.tsx`
- **Features**:
  - URL input field
  - "Fetch Content" button
  - Style selector (4 styles)
  - Language input
  - "Generate Infographic" button
- **Props**:
  - `url`, `style`, `language`: Current values
  - `isGenerating`, `isFetchingContent`, `canGenerate`: Loading/state flags
  - Callbacks for all user actions

#### 2. DashboardClient Updates
- **Location**: `/app/dashboard/DashboardClient.tsx`
- **New Features**:
  - Mode switcher (Headshot vs Infographic)
  - URL and content fetching state management
  - Infographic generation with polling
  - Automatic result polling (3-second intervals)
  - 5-minute timeout for generation
  - Error handling and user feedback

## Infographic Styles

1. **Fun & Playful** (`FUN_PLAYFUL`)
   - Vibrant 2D vector illustrations
   - Bright colors, rounded shapes
   - Friendly tone

2. **Clean Minimalist** (`CLEAN_MINIMALIST`)
   - Ultra-minimalist design
   - Lots of whitespace, thin lines
   - Limited color palette (1-2 accent colors)
   - Sophisticated and airy

3. **Dark Mode Tech** (`DARK_MODE_TECH`)
   - Dark slate/black background
   - Glowing accent colors (cyan, lime green)
   - Technical aesthetic

4. **Modern Editorial** (`MODERN_EDITORIAL`)
   - Flat vector illustration style
   - Clean and professional
   - High-end tech magazine look
   - Cohesive, mature color palette

## Workflow

### Infographic Generation Flow
1. User enters URL in dashboard
2. User clicks "Fetch Content"
3. Frontend calls `/api/fetch-content`
4. Content is displayed as "fetched successfully"
5. User selects style and language
6. User clicks "Generate Infographic"
7. Frontend calls `/api/generate-infographic`
8. Backend returns task ID
9. Frontend polls `/api/poll-infographic` every 3 seconds
10. When status is "succeeded", image is displayed in gallery
11. If failed or timeout (5 min), error is shown

## Environment Setup

Add to `.env.local`:
```env
# Unifuncs Web Reader - Get your key from https://unifuncs.com
UNIFUNCS_API_KEY=your_unifuncs_api_key

# GRSAI Nano Banana - Get your key from https://grsai.com
GRSAI_API_KEY=your_grsai_api_key
```

## Configuration

All endpoints are configured in `/config/app-config.ts`:
```typescript
ENDPOINTS: {
  FETCH_CONTENT: '/api/fetch-content',
  GENERATE_INFOGRAPHIC: '/api/generate-infographic',
  POLL_INFOGRAPHIC: '/api/poll-infographic',
  // ... other endpoints
}
```

## Testing

To test the implementation:

1. Set up API keys in `.env.local`
2. Start the development server: `npm run dev`
3. Navigate to `/dashboard`
4. Switch to "Infographic Generator" mode
5. Enter a URL (e.g., a blog post or article)
6. Click "Fetch Content"
7. Select a style
8. Click "Generate Infographic"
9. Wait for the result to appear in the gallery

## API Details

### GRSAI API Integration

The implementation uses the GRSAI Nano Banana API with the following specifics:

1. **Generation Request** (`/v1/draw/nano-banana`):
   - Uses `webHook: "-1"` to get immediate task ID response
   - Returns: `{ code: 0, msg: "success", data: { id: "task-id" } }`

2. **Result Polling** (`/v1/draw/result`):
   - Uses POST method (not GET)
   - Request body: `{ id: "task-id" }`
   - Returns: `{ code: 0, msg: "success", data: { id, status, progress, results, ... } }`
   - Status codes:
     - `code: 0` = success
     - `code: -22` = task not found (treated as pending)

## Known Limitations

1. **Build Issue**: Google Fonts fetch fails in some environments due to network restrictions. This is unrelated to the infographic feature.
2. **Credit System**: Infographic generation currently doesn't consume credits from the existing credit system. This may need to be integrated in the future.

## Future Enhancements

1. Integrate infographic generation with the credit system
2. Add generation history specific to infographics
3. Support for batch infographic generation
4. Add more customization options (aspect ratio selector in UI)
5. Add preview of fetched content before generation
6. Support for streaming responses instead of polling
