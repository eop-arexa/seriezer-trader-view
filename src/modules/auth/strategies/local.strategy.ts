import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { plainToInstance } from 'class-transformer';
import { Strategy } from 'passport-local';
import { UserResponseDto } from 'src/modules/users/dtos/user-response.dto';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'user_local') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<UserResponseDto> {
    const user = await this.authService.validateUserWithUsernameAndPassword(username, password);

    if (!user) {
      throw new BadRequestException(`Username and password are incorrect`);
    }

    return plainToInstance(UserResponseDto, user);
  }
}
