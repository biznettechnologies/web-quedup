const MAX_RESTAURANTS = 100

const query = `query ($restaurant_id: Int!, $channel_id: ID!) {
  restaurant(id: $restaurant_id) {
    id
    name
    integrations(channel_id: $channel_id) { remote_id }
    cuisines
    locations {
      address {
        nickname
      }
    }
  }
}`

const makeParams = ({page, per_page}) => ({
  conditions: [ { "field": "name", "op": "starts_with", "value": "*" } ],
  sort: [ { "type": "term", "value": "name", "order": "asc" } ],
  required_data: query,
  use_zds: true,
  page,
  per_page,
})

const fetchRestaurants = (channel, page = 1) =>
  fetch(`http://restaurants-api5.zuppler.com/v5/channels/${channel}/search`, {
    "headers": {
      "accept": "application/json",
      "content-type": "application/json; charset=utf-8",
    },
    "body": JSON.stringify(makeParams({page, per_page: 100})),
    "method": "POST",
  })
  .then(res => res.json())

export default async function getAllRestaurants(channel, _page = 1) {
  try {
    const part = await fetchRestaurants(channel, _page);
    const { page, per_page, results, total } = part
    const loaded = page * per_page
    if (total > 0 && loaded < total && loaded < MAX_RESTAURANTS) {
      return results.concat(await getAllRestaurants(channel, page + 1))
    } else {
      return results
    }
  } catch (err) {
    console.error(err);
  }
}