import siteConfig from '../../site.config.js'
import getRestaurants from '../../stores/restaurants.js'

export default async (request, context) => {
  const d = new Date()
  const lastmod = d.toISOString(); // Get the date in ISO 8601 format with time
  const url = new URL(request.url)

  const pagesP = siteConfig.orderPages
    .map(async p => {
      let restaurants = []
      if(p.isPortal) {
        restaurants = await getRestaurants(p.channel)
      } else {
        restaurants = [{id: p.restaurantID, integrations: [{remote_id: p.restaurantPermalink}]}]
      }
      return {...p, restaurants}
    })
  
  const pagesWithResults = await Promise.all(pagesP)
  
  const siteMaps = pagesWithResults
    .map(p => 
      p.restaurants.map(r => `
        <url>
          <loc>${url.origin}${p.url}/restaurants/${r.integrations[0].remote_id}/${r.id}</loc>
          <lastmod>${lastmod}</lastmod>
        </url>
      `).join('')
    )
    .join('')

  const sitemapIndex = `<?xml version="1.0" encoding="utf-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${siteMaps}
    </urlset>
  `

  return new Response(sitemapIndex, {
    headers: { "content-type": "application/xml" },
  });
};