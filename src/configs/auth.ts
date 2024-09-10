export default {
  meEndpoint: '/auth/me',
  loginEndpoint: `/authenticate`,
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  userStorangeKeyName: 'UserInformation',
  onTokenExpiration: 'refreshToken'
}
