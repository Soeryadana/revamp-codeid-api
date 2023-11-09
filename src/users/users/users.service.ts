import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'output/entities/Users';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { SignUpDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private userRepo: Repository<Users>,
    private jwtService: JwtService,
  ) {}

  public async validateUser(username: string, password: string) {
    const user = await this.userRepo.findOne({
      where: [{ userName: username }, { userEmail: username }],
    });

    if (user) {
      const compare = await bcrypt.compare(password, user.userPassword);
      if (compare) {
        const { userPassword, ...result } = user;
        return result;
      } else {
        throw new UnauthorizedException();
      }
    }

    return null;
  }

  public async login(user: any) {
    const payload = {
      userid: user.userEntityId,
      username: user.userName,
      firstname: user.userFirstName,
      lastname: user.userLastName,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  public async getUserData(userEntityId: number) {
    try {
      const userData = await this.userRepo.findOne({
        where: {
          userEntityId: userEntityId,
        },
        relations: {
          usersEducations: true,
        },
      });

      return userData;
    } catch (error) {
      error.message;
    }
  }

  public async findOne(userEntityId: number) {
    return await this.userRepo
      .createQueryBuilder('user')
      .where('user.userEntityId = :userEntityId', { userEntityId })
      .leftJoinAndSelect('user.usersEducations', 'usersEducation')
      .getOne();
  }

  public async SignUp(signUp: SignUpDto): Promise<Users> {
    try {
      const userExist = await this.userRepo.findBy({
        userName: signUp.username,
      });

      if (userExist) throw new BadRequestException('Username Already Exist');

      const salt = 10;
      const hashPassword = await bcrypt.hash(signUp.password, salt);

      const signUpUser = this.userRepo.create({
        userName: signUp.username,
        userPassword: hashPassword,
        userFirstName: signUp.userFirstName,
        userLastName: signUp.userLastName,
        userEmail: signUp.userEmail,
        userPhone: signUp.userPhone,
      });

      return await this.userRepo.save(signUpUser);
    } catch (error) {
      return error.message;
    }
  }
}
