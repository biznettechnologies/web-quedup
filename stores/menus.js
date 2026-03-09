const query = `query GetRestaurantMenus($restaurant_id: Int!) { 
  menus(restaurantId: $restaurant_id) {
    id
    name
    description
    default
    categories {
      id
      name
      description
      items {
        id
        name
        description
        price
      }
    }
  }
}`

const reqBody = id => ({
  operationName: "GetRestaurantMenus",
  query,
  variables: { restaurant_id:id }
})

const fetchMenus = (restaurantId) =>
  fetch("https://restaurants-api5.zuppler.com/graphql", {
    "headers": {
      "accept": "application/json",
      "content-type": "application/json; charset=utf-8",
    },
    "body": JSON.stringify(reqBody(restaurantId)),
    "method": "POST",
  })
  .then(res => res.json())
  .then(res => res.data.menus)

export default fetchMenus