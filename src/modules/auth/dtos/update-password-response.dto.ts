import { Exclude } from 'class-transformer';
import { UserResponseDto } from 'src/modules/users/dtos/user-response.dto';

@Exclude()
export class UpdatePasswordResponseDto extends UserResponseDto {}
