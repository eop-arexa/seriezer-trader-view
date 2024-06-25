import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserResponseDto } from 'src/modules/users/dtos/user-response.dto';
import { ConfigService } from '../core/config.service';
import { UsersService } from '../users/users.service';
import { RegisterRequestDto } from './dtos/register-request.dto';
import { UserDocument } from '../users/user.schema';
import { LoginRequestDto } from './dtos/login-request.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async validateUserWithUsernameAndPassword(username: string, password: string): Promise<UserDocument> {
    return this.usersService.getUserWithUsernameAndPassword(username, password);
  }

  async login(payload: LoginRequestDto) {
    const user = await this.validateUserWithUsernameAndPassword(payload.username, payload.password);

    const { access_token, refresh_token } = await this.getTokens(payload);
    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      access_token,
      refresh_token,
    };
  }

  async register(registerRequest: RegisterRequestDto) {
    const user = await this.usersService.addNewUser(registerRequest);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    };
  }

  async getTokens(payload) {
    const refreshTokenConfig = this.configService.getAuthConfiguration().refreshToken;

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        expiresIn: refreshTokenConfig.expireTime,
        secret: refreshTokenConfig.secretKey,
      }),
    ]);
    return {
      access_token,
      refresh_token,
    };
  }
}
