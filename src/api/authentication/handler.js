import autoBind from 'auto-bind';

export class AuthHandler {
  constructor(userService, authService, tokenManager, validator) {
    this._userService = userService;
    this._authService = authService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    autoBind(this);
  }

  async postAuthHandler(request, h) {
    this._validator.validatePostAuthPayload(request.payload);
    const { username, password } = request.payload;

    const id = await this._userService.verifyUserCredential(username, password);

    const accessToken = this._tokenManager.generateAccessToken({ id });
    const refreshToken = this._tokenManager.generateRefreshToken({ id });

    await this._authService.addRefreshToken(refreshToken);

    const response = h.response({
      status: 'success',
      data: {
        accessToken,
        refreshToken,
      }
    }).code(201);

    return response;
  }

  async putAuthHandler(request) {
    this._validator.validatePutAuthPayload(request.payload);
    const { refreshToken } = request.payload;

    await this._authService.verifyRefreshToken(refreshToken);
    const { id } = await this._tokenManager.verifyRefreshToken(refreshToken);

    const accessToken = this._tokenManager.generateAccessToken({ id });

    return {
      status: 'success',
      data: {
        accessToken,
      }
    };
  }

  async deleteAuthHandler(request) {
    this._validator.validateDeleteAuthPayload(request.payload);
    const { refreshToken } = request.payload;

    await this._authService.verifyRefreshToken(refreshToken);
    await this._authService.deleteRefreshToken(refreshToken);

    return {
      status: 'success',
      message: 'Refresh token successfully deleted',
    };
  }
}