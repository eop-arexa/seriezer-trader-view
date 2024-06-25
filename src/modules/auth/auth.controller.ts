import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dtos/login-request.dto';
import { LoginResponseDto } from './dtos/login-response.dto';
import { RegisterRequestDto } from './dtos/register-request.dto';
import { RegisterResponseDto } from './dtos/register-response.dto';
import { User } from '../../shares/decorators/user.decorator';
import { UserProperties } from '../../shares/constants/constant';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    operationId: 'userRegister',
    description: 'User register an account',
    summary: 'User register an account',
  })
  @ApiBody({
    type: RegisterRequestDto,
  })
  @ApiResponse({
    type: RegisterResponseDto,
    status: HttpStatus.CREATED,
    description: 'Successful',
  })
  async register(@Body() registerRequest: RegisterRequestDto): Promise<RegisterResponseDto> {
    const res = await this.authService.register(registerRequest);
    return plainToInstance(RegisterResponseDto, res);
  }

  @Post('login')
  @ApiOperation({
    operationId: 'userLogin',
    description: 'User login with username and password, received login token',
    summary: 'User login with username and password, received login token',
  })
  @ApiBody({
    type: LoginRequestDto,
  })
  @ApiResponse({
    type: LoginResponseDto,
    status: HttpStatus.OK,
    description: 'Successful',
  })
  async login(@Body() payload: LoginRequestDto): Promise<LoginResponseDto> {
    const res = await this.authService.login(payload);
    return plainToInstance(LoginResponseDto, res);
  }
}
