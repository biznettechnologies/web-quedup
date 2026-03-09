import siteConfig from '../../site.config.js'
import getRestaurantMenus from '../../stores/menus.js'
import getRestaurants from '../../stores/restaurants.js'
import getRestaurantInfo from '../../stores/restaurant.js'

import { EleventyEdge, precompiledAppData } from "./_generated/eleventy-edge-app.js";

const _orderPages = siteConfig.orderPages.map(p => p.url.replace("/", "")).join("|");

const getRegex = () => new RegExp(
  `^\/(${_orderPages})` + 
  `(?:\/(restaurants|home|locations))?` + // page
  `(?:\/([a-zA-Z0-9]+))?` + // rest
  `(?:\/([0-9]+))?` + // restID
  `(?:\/(menus))?` +
  `(?:\/([0-9]+))?` + // menuID
  `(?:\/(categories))?` +
  `(?:\/([0-9]+))?` + // catID
  `[\/#\?]?`,
  "gi"
)

export default async (request, context) => {
  const url = new URL(request.url);
  
  const matches = getRegex().exec(url.pathname) || []
  
  const [
    _,
    _orderPage,
    page,
    _permalink,
    _restaurantId,
    __,
    menuId,
    ___,
    categoryId
  ] = matches

  // console.table({
  //   _orderPage,
  //   page,
  //   _permalink,
  //   _restaurantId,
  //   menuId,
  //   categoryId
  // })
  
  let menus
  let restaurants
  let restaurantInfo

  if(!_orderPage) return context.next()
  const orderPage = siteConfig.orderPages.filter(p => p.url === `/${_orderPage}`)[0]
  if(!orderPage) return context.next()
  
  const defPermalink = orderPage.isPortal ? null : orderPage.restaurantPermalink;
  const defRestID = orderPage.isPortal ? null : orderPage.restaurantID;

  const permalink = _permalink || defPermalink
  const restaurantId = _restaurantId || defRestID

  if(
    orderPage.isPortal && 
    (page === "home" || page ==="locations" || (
      !page && !_permalink && !_restaurantId
    ))
  ) {
    restaurants = await getRestaurants(orderPage.channel)
  } else if(permalink && restaurantId) {
    menus = await getRestaurantMenus(parseInt(restaurantId))
    restaurantInfo = await getRestaurantInfo(parseInt(restaurantId))
  }

  try {
    let edge = new EleventyEdge("edge", {
      request,
      context,
      precompiled: precompiledAppData,
      cookies: [],
    });

    edge.config((eleventyConfig) => {
      eleventyConfig.addGlobalData("appData", {
        permalink, restaurantId, menuId, categoryId, menus, restaurants, restaurantInfo
      })
    });

    return await edge.handleResponse();
  } catch (e) {
    console.log("ERROR", { e });
    return context.next(e);
  }
};

// https://docs.netlify.com/edge-functions/declarations/#declare-edge-functions-inline
export const config = {
  path: siteConfig.orderPages.reduce((acc, {url}) => ([...acc, url, `${url}/*`]), [])
}