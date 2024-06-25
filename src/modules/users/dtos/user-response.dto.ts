import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { PaginationDto } from 'src/shares/pagination/pagination.dto';
import { UserStatus } from '../user.schema';

@Exclude()
export class UserResponseDto {
  @Expose()
  @ApiProperty({
    type: Number,
    name: 'id',
    description: 'Id of user in db',
  })
  id: number;

  @Expose()
  @ApiProperty({
    type: String,
    name: 'username',
    description: 'Username of user',
    example: 'john',
  })
  username: string;

  @Expose()
  @ApiProperty({
    type: String,
    name: 'email',
    description: 'Username of user',
  })
  email: string;

  @Expose()
  @ApiProperty({
    name: 'status',
  })
  status: UserStatus;

  @Expose()
  @ApiProperty({
    type: String,
    name: 'first_name',
    description: 'First name of user',
  })
  firstName: string;

  @Expose()
  @ApiProperty({
    type: String,
    name: 'last_name',
    description: 'Last name of user',
  })
  lastName: string;

  @Expose()
  @ApiProperty({
    type: String,
    name: 'address',
    description: 'Address of user',
  })
  address: string;

  @Expose()
  @ApiProperty({
    type: String,
    name: 'avatar',
    description: 'Address of user',
  })
  avatar: string;

  @Expose()
  @ApiProperty({
    type: String,
    name: 'phone',
    description: 'Avatar of user',
  })
  phone: string;
}

export class AdminIndexUser extends PaginationDto {
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Search email',
    example: 'john@gmail.com',
  })
  email?: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: Number,
    enum: UserStatus,
    description: 'Search status',
    example: UserStatus.ACTIVE,
  })
  status?: UserStatus;
}
