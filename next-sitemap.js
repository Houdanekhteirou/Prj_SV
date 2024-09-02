module.exports = {
  siteUrl: 'https://www.portailpbf.gov.mr',
  generateRobotsTxt: true,
  exclude: ['/api/*', '/_next/*', '/static/*'],
  robotsTxtOptions: {
    additionalSitemaps: ['https://www.portailpbf.gov.mr/sitemap.xml']
  }
}
