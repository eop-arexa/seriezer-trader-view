import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { RegisterRequestDto } from 'src/modules/auth/dtos/register-request.dto';
import { UserStatus } from '../../users/user.schema';

export class RegisterGoogleRequestDto extends RegisterRequestDto {
  @Expose()
  @ApiProperty({
    type: String,
    description: 'First name of user',
    example: 'John',
  })
  @IsString()
  @IsOptional()
  first_name?: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Last name of user',
    example: 'Doe',
  })
  @IsString()
  @IsOptional()
  last_name?: string;

  @Expose()
  @ApiProperty({
    enum: UserStatus,
    description: 'Status of user',
    example: UserStatus.ACTIVE,
  })
  status: UserStatus;
}
