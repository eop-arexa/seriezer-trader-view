import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { UserResponseDto } from 'src/modules/users/dtos/user-response.dto';

@Exclude()
export class LoginResponseDto {
  @Expose()
  @ApiProperty({
    type: UserResponseDto,
    description: 'User info',
  })
  user: UserResponseDto;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhvYW5',
  })
  access_token: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Refresh token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhvYW5',
  })
  refresh_token: string;
}
