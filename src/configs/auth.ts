export default {
  meEndpoint: '/auth/me',
  loginEndpoint: `/api/authenticate`,
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  userStorangeKeyName: 'UserInformation',
  onTokenExpiration: 'refreshToken'
}
