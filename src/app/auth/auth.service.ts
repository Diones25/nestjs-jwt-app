import { Injectable } from '@nestjs/common';
import { UsersEntity } from 'src/app/users/user.entity';
import { UsersService } from 'src/app/users/users.service';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService, private readonly jwtService: JwtService) { }

  async login(user) {
    const payload = { sub: user.id, email: user.email };

    return {  
      token: this.jwtService.sign(payload),
    };
  }
  
  async validateUser(email: string, password: string): Promise<any> {
    let user;
    try {
      user = await this.userService.findByEmail(email);
    } catch (error) {
      return null;
    }
    
    const isPasswordValid = compareSync(password, user.password);
    if (!isPasswordValid) return null;

    return user;
  }
}
