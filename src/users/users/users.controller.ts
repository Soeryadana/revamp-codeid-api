import {
  Controller,
  UseGuards,
  Post,
  Request,
  Get,
  Query,
  ParseIntPipe,
  NotFoundException,
  Body,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { SignUpDto } from './dto/users.dto';

// @Controller('users')
@Controller('revamp-codeid/users')
export class UsersController {
  constructor(private authService: UsersService) {}

  @UseGuards(AuthGuard('local'))
  @Post('signin')
  public async signIn(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  public async getProfile(@Request() req) {
    return req.user;
  }

  @Post('signup')
  public async singUp(@Body() signUp: SignUpDto) {
    return this.authService.SignUp(signUp);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/')
  public async getOne(
    @Query('userEntityId', ParseIntPipe) userEntityId: number,
  ) {
    const user = await this.authService.findOne(userEntityId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userEducation = user.usersEducations.map((education) => ({
      EducationId: education.usduId,
      School: education.usduSchool,
      Degree: education.usduDegree,
      Study: education.usduFieldStudy,
    }));

    return {
      userEntityId: user.userEntityId,
      userName: user.userName,
      userFirstName: user.userFirstName,
      userLastName: user.userLastName,
      userBirthDate: user.userBirthDate,
      userPhoto: user.userPhoto,
      userEducation: userEducation,
    };
  }
}
