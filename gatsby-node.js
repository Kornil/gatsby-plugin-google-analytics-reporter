const crypto = require('crypto');
const { google } = require('googleapis');

exports.sourceNodes = async ({ actions, createNodeId }, configOptions) => {
  const { createNode } = actions;
  const scopes = 'https://www.googleapis.com/auth/analytics.readonly';

  const jwt = new google.auth.JWT(
    configOptions.email,
    null,
    // fix netlify \n in env vars
    // https://github.com/auth0/node-jsonwebtoken/issues/642#issuecomment-585173594
    configOptions.privateKey.replace(/\\n/gm, '\n'),
    scopes
  );
  await jwt.authorize();

  const analyticsReporting = google.analyticsreporting({
    version: 'v4',
    auth: jwt,
  });

  const result = await analyticsReporting.reports.batchGet({
    requestBody: {
      reportRequests: [
        {
          viewId: configOptions.viewId,
          dateRanges: [
            {
              startDate: configOptions.startDate || '2008-01-01',
              endDate: configOptions.endDate || 'today',
            },
          ],
          metrics: [
            {
              expression: 'ga:pageviews',
            },
          ],
          dimensions: [
            {
              name: 'ga:pagePath',
            },
          ],
          orderBys: [
            {
              sortOrder: 'DESCENDING',
              fieldName: 'ga:pageviews',
            },
          ],
          pageSize: configOptions.pageSize || 1000,
        },
      ],
    },
  });

  const { rows } = result.data.reports[0].data;
  for (const { dimensions, metrics } of rows) {
    const path = dimensions[0];
    const totalCount = metrics[0].values[0];
    createNode({
      path,
      totalCount: Number(totalCount),
      id: createNodeId(path),
      internal: {
        type: `PageViews`,
        contentDigest: crypto
          .createHash(`md5`)
          .update(JSON.stringify({ path, totalCount }))
          .digest(`hex`),
        mediaType: `text/plain`,
        description: `Page views per path`,
      },
    });
  }
};
