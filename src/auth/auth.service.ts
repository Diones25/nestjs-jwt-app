import { Injectable } from '@nestjs/common';
import { UsersEntity } from 'src/app/users/user.entity';
import { UsersService } from 'src/app/users/users.service';
import { compareSync } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) { }
  
  async validateUser(email: string, password: string): Promise<any> {
    let user: UsersEntity;
    try {
      user = await this.userService.findOrFail(email);
    } catch (error) {
      return null;
    }
    
    const isPasswordValid = compareSync(password, user.password);
    if (!isPasswordValid) return null;

    return user;
  }
}
