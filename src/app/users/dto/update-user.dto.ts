import { IsNotEmpty } from "class-validator";

export class UpdateUserDto {
  @IsNotEmpty({ message: 'firstName não deve estar vazio' })
  firstName: string;

  @IsNotEmpty({ message: 'lastName não deve estar vazio' })
  lastName: string;
}

