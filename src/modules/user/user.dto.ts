import { IsNotEmpty } from 'class-validator';

export class RegisterUserDTO {
  readonly name: string;

  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  readonly password: string;

  @IsNotEmpty()
  readonly phone: string;
}

export class CreateUserDTO extends RegisterUserDTO {
  @IsNotEmpty()
  readonly passwordSalt: string;
}

export class EditUserDTO {
  readonly name: string;

  @IsNotEmpty()
  readonly username: string;
  readonly password: string;
  readonly phone: string;
}
