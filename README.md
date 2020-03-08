# gatsby-plugin-google-analytics-reporter

Queries page views data from google analytics.

## How to use

Install the package.

`$ npm i gatsby-plugin-google-analytics-reporter`

Add it to `gatsby-config.js`, make sure you have set up the variables needed to query analytics ([guide here]())


```js
// gatsby-config.js
{
  resolve: `gatsby-plugin-google-analytics-reporter`,
  options: {
    email: process.env.CLIENT_EMAIL,
    privateKey: process.env.PRIVATE_KEY,
    viewId: process.env.VIEWID,
    startDate: `30daysAgo`,
    endDate: `today`
  }
},
```

The plugin accept an object following the schema below.

| Prop        | Required |   Type | Description                                                                                                                                                                                                                |
| ----------- | :------: | -----: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| clientEmail |   true   | string | The service account email enabled on [Google Could](https://console.cloud.google.com/) to query the analytics service                                                                                                      |
| privateKey  |   true   | string | The private key from the service account provided above                                                                                                                                                                    |
| viewId      |   true   | string | Google analytics viewId for the project to query. It can be found on google analytics > Admin (cog icon) > View settings                                                                                                   |
| startDate   |  false   | string | The start and end dates are specified in ISO8601 date format YYYY-MM-DD, ex: 2010-04-28. Everything accepted by Google Reporter, like `30daysAgo`, `today` and `yesterday` is also a valid input. Defaults to `2008-01-01` |
| endDate     |  false   | string | The start and end dates are specified in ISO8601 date format YYYY-MM-DD, ex: 2010-04-28. Everything accepted by Google Reporter, like `30daysAgo`, `today` and `yesterday` is also a valid input. Defaults to `today`      |

Once implemented, you can check that the query work on `localhost:8000/__graphql`. There you will find two new keys available for queries: `pageViews` and `allPageViews`.

Examples for both queries:

```js
// graphql
query MyQuery {
  allPageViews(sort: {order: DESC, fields: totalCount}) {
    nodes {
      id
      totalCount
    }
  }
}

// returns
{
  "data": {
    "allPageViews": {
      "nodes": [
        {
          "id": "/",
          "totalCount": 703
        },
        {
          "id": "/how-to-set-up-gatsby-typescript-eslint-prettier/",
          "totalCount": 126
        },
        {
          "id": "/react-hooks-vs-redux/",
          "totalCount": 121
        },
      ],
    },
  },
}
```


```js
// graphql
query MyQuery {
  pageViews(id: {eq: "/how-to-set-up-gatsby-typescript-eslint-prettier/"}) {
    id
    totalCount
  }
}

// returns 
{
  "data": {
    "pageViews": {
      "id": "/how-to-set-up-gatsby-typescript-eslint-prettier/",
      "totalCount": 126
    }
  }
}
```

