# Image Extraction Techniques

Technical recipes for pulling images from various platforms and APIs.

## Instagram API (No Auth Required)

This endpoint returns full-res 1080px image URLs for the 12 most recent public posts:

```bash
curl -s "https://i.instagram.com/api/v1/users/web_profile_info/?username=[handle]" \
  -H "User-Agent: Instagram 275.0.0.27.98 Android" \
  -H "X-IG-App-ID: 936619743392459" | python3 -c "
import json, sys, os
d = json.load(sys.stdin)
u = d['data']['user']
print(f'Profile: @{u[\"username\"]}')
print(f'Followers: {u[\"edge_followed_by\"][\"count\"]:,}')
print(f'Posts: {u[\"edge_owner_to_timeline_media\"][\"count\"]}')
edges = u.get('edge_owner_to_timeline_media',{}).get('edges',[])
os.makedirs('instagram', exist_ok=True)
for i, e in enumerate(edges):
    n = e['node']
    url = n['display_url']
    caption = (n.get('edge_media_to_caption',{}).get('edges',[{}])[0].get('node',{}).get('text',''))[:100]
    likes = n.get('edge_liked_by',{}).get('count',0)
    print(f'Post {i+1}: {likes:,} likes | {caption}')
    os.system(f'curl -sL \"{url}\" -o instagram/post-{i+1:02d}.jpg')
"
```

**Rate limits:** ~200 requests/hour without auth. One call per brand is fine.

**Returns:** Profile stats + up to 12 post images with engagement data, captions, and post type.

**If this endpoint is blocked:** Fall back to Playwright screenshots of the Instagram grid page.

## Agency Case Study Images (Prismic CMS)

Many design studios (Porto Rocha, Collins, etc.) use Prismic CMS. Their images are accessible via API:

```bash
# 1. Get the API master ref
MASTER_REF=$(curl -sL "https://[studio].cdn.prismic.io/api/v2" | \
  python3 -c "import json,sys; d=json.load(sys.stdin); print([r['ref'] for r in d['refs'] if r.get('isMasterRef')][0])")

# 2. Search for case studies
curl -sL "https://[studio].cdn.prismic.io/api/v2/documents/search?ref=${MASTER_REF}&q=%5B%5Bat(document.type%2C%22case_study%22)%5D%5D&pageSize=100"

# 3. Extract image URLs from the JSON response
# Append &w=1400 to any Prismic image URL for high-res download
```

Common Prismic studio subdomains to try: `[studio-name].cdn.prismic.io`

## Generic Image Extraction from Web Pages

For any case study page, extract all image URLs from the HTML:

```bash
# Fetch the page and extract image sources
curl -sL "https://agency.com/case-study/brand" | python3 -c "
import sys, re
html = sys.stdin.read()
# Find all image URLs (handles src, data-src, srcset, background-image)
patterns = [
    r'src=[\"\\']([^\"\\' ]+\\.(?:jpg|jpeg|png|webp))[\"\\']',
    r'data-src=[\"\\']([^\"\\' ]+\\.(?:jpg|jpeg|png|webp))[\"\\']',
    r'url\([\"\\']?([^\"\\')]+\\.(?:jpg|jpeg|png|webp))[\"\\']?\)',
]
urls = set()
for p in patterns:
    urls.update(re.findall(p, html, re.IGNORECASE))
for url in sorted(urls):
    print(url)
"
```

Filter by dimensions — skip icons and thumbnails (< 400px wide). Download the best candidates.

## YouTube Thumbnails

```bash
yt-dlp --write-thumbnail --skip-download --playlist-items 1-5 \
  "https://www.youtube.com/@[handle]/videos" -o "youtube/%(title)s.%(ext)s"
```

This downloads the highest-resolution thumbnail for each video without downloading the video itself.

**If yt-dlp is not installed:** Use `web_search "[brand] youtube channel"` and screenshot the channel page with Playwright.

## TikTok (Limited Access)

TikTok's API is locked down. Available approaches:

1. **Playwright screenshots** of the public profile grid (best option)
2. **yt-dlp** for individual video thumbnails if URLs are known
3. **Apify TikTok scraper** if an API key is available (~$1.70/1k results)

## CDN Resolution Patterns

Common CDN URL patterns and how to extract maximum resolution. Apply these before downloading any image.

| CDN/CMS | URL pattern | How to maximize |
|---------|-------------|-----------------|
| Contentful | `images.ctfassets.net/...?w=800&h=600` | Remove `?w=` and `?h=` params, or set `w=2000` |
| Prismic | `images.prismic.io/...?w=800` | Append `&w=2000` or remove width param |
| DatoCMS | `www.datocms-assets.com/...?w=800` | Remove query params for original, or `?w=2000` |
| Sanity | `cdn.sanity.io/.../image-...?w=800` | Remove `?w=` param for full resolution |
| Cloudinary | `res.cloudinary.com/.../w_400,h_300/...` | Remove or increase transform values: `w_2000` |
| Imgix | `...imgix.net/...?w=800&fit=crop` | Remove `w=`, `h=`, `fit=` params |
| Shopify | `cdn.shopify.com/...file_200x200.jpg` | Remove dimensions: `file.jpg` or use `_2000x2000` |
| WordPress | `wp-content/.../image-800x600.jpg` | Remove `-800x600` before extension |
| Vercel/Next.js | `/_next/image?url=...&w=640&q=75` | Extract the `url` param, fetch directly |
| Webflow | `uploads-ssl.webflow.com/.../-w-800.jpg` | Remove `-w-800` or replace with larger value |
| Squarespace | `images.squarespace-cdn.com/...?format=500w` | Change `format=2500w` or remove param |

**General heuristic:** If an image URL contains numbers that look like dimensions (400, 600, 800, 1024) in the path or query string, try removing them or increasing to 2000. Worst case, you get a 404 and fall back to the original URL.

## Homepage Hero Extraction

For extracting the main hero image from any brand's homepage:

1. **Playwright screenshot** of above-the-fold (captures what the user sees)
2. **HTML source inspection** for hero image URLs:
   ```bash
   curl -sL "https://brand.com" | python3 -c "
   import sys, re
   html = sys.stdin.read()
   # Look for hero/banner containers
   hero_patterns = [
       r'class=[\"\\'][^\"\\']*(hero|banner|masthead|jumbotron|splash)[^\"\\'].*?(?:src|background-image)[=:]\\s*[\"\\']?([^\"\\')\\s]+)',
       r'<video[^>]+poster=[\"\\']([^\"\\' ]+)[\"\\']',
   ]
   for p in hero_patterns:
       for match in re.findall(p, html, re.IGNORECASE | re.DOTALL):
           print(match[-1] if isinstance(match, tuple) else match)
   "
   ```
3. **CMS API check** — if the site uses a headless CMS, the API often exposes the original upload without resizing. Apply CDN Resolution Patterns (above) to strip resize params.

## Downloading Images

For any direct image URL:

```bash
curl -sL "[image-url]" -o "[output-filename]"
```

For batch downloads, create a URL list file and iterate:

```bash
while IFS= read -r url; do
  filename=$(basename "$url" | sed 's/?.*//')
  curl -sL "$url" -o "downloads/$filename"
done < urls.txt
```
