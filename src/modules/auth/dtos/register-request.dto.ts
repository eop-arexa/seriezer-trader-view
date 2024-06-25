import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsOptional, IsString, IsUrl, NotContains } from 'class-validator';

@Exclude()
export class RegisterRequestDto {
  @Expose()
  @IsString()
  @NotContains(' ', { message: 'Username cannot contain space' })
  @ApiProperty({
    type: String,
    description: 'Username of user',
    example: 'john',
  })
  username: string;

  @Expose()
  @IsEmail()
  @ApiProperty({
    type: String,
    description: 'Email of user',
    example: 'john@gmail.com',
  })
  email: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Password of user',
    example: '1',
  })
  @IsString()
  password: string;

  @IsOptional()
  @Expose()
  @ApiProperty({
    type: String,
    description: 'Fullname of user',
    example: 'john nathan',
  })
  @IsString()
  fullName?: string;

  @IsOptional()
  @Expose()
  @ApiProperty({
    type: String,
    description: 'Lastname of user',
    example: 'john nathan',
  })
  @IsString()
  lastName?: string;

  @IsOptional()
  @Expose()
  @ApiProperty({
    type: String,
    description: 'Phone of user',
    example: '+0128736',
  })
  @IsString()
  phone?: string;

  @IsOptional()
  @Expose()
  @ApiProperty({
    type: String,
    description: 'Address of user',
    example: 'NY',
  })
  @IsString()
  address?: string;
}
