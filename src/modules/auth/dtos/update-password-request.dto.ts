import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

@Expose()
export class ResetPasswordRequestDto {
  @Expose()
  @ApiProperty({
    type: String,
    description: 'New password',
    example: '2',
  })
  @IsNotEmpty()
  @IsString()
  newPassword: string;
}

@Expose()
export class UpdatePasswordRequestDto {
  @Expose()
  @ApiProperty({
    type: String,
    description: 'Current password',
    example: '1',
  })
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'New password',
    example: '2',
  })
  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
