import { BadRequestException, Injectable } from '@nestjs/common';
import { hashString, isHashEqual } from '../../shares/helpers/cryptography';
import { RegisterRequestDto } from '../auth/dtos/register-request.dto';
import { UserRepository } from './user.repository';
import { UserDocument, UserStatus } from './user.schema';
import { isNullOrUndefined } from '../../shares/helpers/utils';
import { UserUnauthenticatedException } from '../../shares/exceptions/auth.exception';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(registerRequestDto: RegisterRequestDto) {
    const user = await this.userRepository.findOne({
      email: registerRequestDto.email,
    });
    if (!isNullOrUndefined(user)) {
      throw new BadRequestException(`${registerRequestDto.email} existed`);
    }

    const isUserNameExist = await this.userRepository.findOne({
      username: registerRequestDto.username,
    });
    if (isUserNameExist) {
      throw new BadRequestException(`${registerRequestDto.username} existed`);
    }

    return this.userRepository.createOne({
      ...registerRequestDto,
      status: UserStatus.ACTIVE,
    });
  }

  async addNewUser(registerRequestDto: RegisterRequestDto): Promise<UserDocument> {
    registerRequestDto.password = await hashString(registerRequestDto.password);

    return this.createUser(registerRequestDto);
  }

  async getUserByEmail(email: string, throwException = false): Promise<UserDocument> {
    const user = await this.userRepository.findOne({
      email,
    });
    if (isNullOrUndefined(user) && throwException === true) {
      throw new BadRequestException(`${email} is not found`);
    }

    return user;
  }

  async getUserById(id: number): Promise<UserDocument> {
    const user = await this.userRepository.findOne({ id });
    if (isNullOrUndefined(user)) {
      throw new BadRequestException(`${id} is not found`);
    }

    return user;
  }

  async getUserByUsername(username: string, throwException = false): Promise<UserDocument> {
    const user = await this.userRepository.findOne({ username });
    if (isNullOrUndefined(user) && throwException === true) {
      throw new BadRequestException(`${username} is not found`);
    }

    return user;
  }

  async exist(userId: number): Promise<boolean> {
    const user = await this.getUserById(userId);

    return !!user;
  }

  async getUserWithUsernameAndPassword(username: string, password: string) {
    const user = await this.getUserByUsername(username, true);

    return this.checkUserCredential(user, password);
  }

  async checkUserCredential(user: UserDocument, password: string) {
    const isPasswordMatched = await isHashEqual(password, user.password);
    if (!isPasswordMatched) {
      throw new UserUnauthenticatedException(`Username and password don't match`);
    }

    return user;
  }
}
