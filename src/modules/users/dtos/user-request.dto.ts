import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
@Exclude()
export class RequestVerifyPhoneRequestDto {
  @ApiProperty({
    description: 'Phone number',
    example: '84123456789',
  })
  @Expose()
  @IsNotEmpty()
  phone: string;
}

@Exclude()
export class VerifyPhoneRequestDto {
  @ApiProperty({
    description: 'Phone number',
    example: '84123456789',
  })
  @Expose()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'Pin code',
    example: '123456',
  })
  @Expose()
  @IsNotEmpty()
  pin: string;
}
