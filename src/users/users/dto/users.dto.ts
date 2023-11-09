import { IsNotEmpty, IsNumberString } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  userFirstName: string;

  @IsNotEmpty()
  userLastName: string;

  @IsNotEmpty()
  userEmail: string;

  @IsNotEmpty()
  @IsNumberString()
  userPhone: string;
}
