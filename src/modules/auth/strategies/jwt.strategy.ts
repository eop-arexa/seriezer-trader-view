import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/modules/users/users.service';
import { ConfigService } from '../../core/config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'user_jwt') {
  constructor(private readonly configService: ConfigService, private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getAuthConfiguration().jwt.secretKey,
    });
  }

  async validate(payload: any) {
    const { id } = payload;
    return this.userService.getUserById(id);
  }
}
