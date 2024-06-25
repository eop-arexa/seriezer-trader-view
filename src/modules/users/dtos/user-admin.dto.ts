import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { UserStatus } from '../user.schema';

@Exclude()
export class ListUserResponseDto {
  @Expose()
  @ApiProperty({
    type: String,
    name: 'id',
    description: 'Id of user in db',
  })
  id: string;

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
    type: Number,
    name: 'total_spending',
    description: 'Total spent of user',
  })
  total_spending: number;
}
