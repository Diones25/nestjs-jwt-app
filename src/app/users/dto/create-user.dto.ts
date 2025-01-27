import { IsEmail, IsNotEmpty, Matches } from "class-validator";
import { regexHelper } from "src/helpers/regex.helper";

export class CreateUserDto {
  @IsNotEmpty({ message: 'firstName não deve estar vazio' })
  firstName: string;

  @IsNotEmpty({ message: 'lastName não deve estar vazio' })
  lastName: string;

  @IsNotEmpty({ message: 'email não deve estar vazio' })
  @IsEmail({}, { message: 'email deve ser um email válido' })
  email: string;

  @IsNotEmpty({ message: 'password não deve estar vazio' })
  @Matches(regexHelper.password)
  password: string;
}

