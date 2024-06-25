import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

@Exclude()
export class LoginRequestDto {
  @Expose()
  @ApiProperty({
    type: String,
    description: 'username',
    example: 'john',
  })
  username: string;

  @Expose()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Password of user',
    example: '1',
  })
  password: string;
}

export class LoginAdminVerifyRequestDto {
  @Expose()
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    description: 'Id of user',
    example: 1,
  })
  id: number;

  @Expose()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'OTP',
    example: '123456',
  })
  otp: string;
}

export class LoginAdminResendOTPRequestDto {
  @Expose()
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    description: 'Id of user',
    example: 1,
  })
  id: number;
}
