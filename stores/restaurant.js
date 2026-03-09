const query = `query GetRestaurantInfo($id: Int!) { 
    restaurant(id: $id) {
      id
      name
      name
      cuisines
      locations {
        address {
          nickname
        }
      }
    }
  }`
  
  const reqBody = id => ({
    operationName: "GetRestaurantInfo",
    query,
    variables: { id }
  })
  
  const fetchRestaurantInfo = (restaurantId) =>
    fetch("https://restaurants-api5.zuppler.com/graphql", {
      "headers": {
        "accept": "application/json",
        "content-type": "application/json; charset=utf-8",
      },
      "body": JSON.stringify(reqBody(restaurantId)),
      "method": "POST",
    })
    .then(res => res.json())
    .then(res => res.data.restaurant)
  
  export default fetchRestaurantInfo