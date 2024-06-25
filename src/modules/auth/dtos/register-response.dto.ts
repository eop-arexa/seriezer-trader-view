import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { UserResponseDto } from 'src/modules/users/dtos/user-response.dto';

@Exclude()
export class RegisterResponseDto {
  @Expose()
  @ApiProperty({
    type: UserResponseDto,
    description: 'User info',
  })
  user: UserResponseDto;
}
