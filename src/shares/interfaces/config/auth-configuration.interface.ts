export interface IAuthConfiguration {
  jwt: {
    secretKey: string;
    expireTime: string | number;
  };

  refreshToken: {
    secretKey: string;
    expireTime: string | number;
  };

  verifyToken: {
    secretKey: string;
    expireTime: number;
  };

  merchantUserActivateToken: {
    secretKey: string;
    expireTime: number;
  };

  merchantUserResetPasswordToken: {
    secretKey: string;
    expireTime: number;
  };

  adminUserResetPasswordToken: {
    secretKey: string;
    expireTime: number;
  };

  google: {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
  };

  merchantOnboard: {
    expireTime: number;
  };

  adminLogin: {
    expireTime: number;
  };
}
