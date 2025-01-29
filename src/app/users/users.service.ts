import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UsersEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>
  ) { }
  
  async findAll(): Promise<UsersEntity[]> {
    return this.usersRepository.find({ select: ['id', 'firstName', 'lastName', 'email'] });
  }

  async findOrFail(id: string): Promise<UsersEntity> {
    try {
      return await this.usersRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async findByEmail(email: string){
    try {
      return await this.usersRepository.findOne({
        where: { email }
      });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async store(data: CreateUserDto) {
    const user = await this.usersRepository.create(data);
    return this.usersRepository.save(user);
  }

  async update(id: string, data: UpdateUserDto){
    const user = await this.findOrFail(id);
    this.usersRepository.merge(user, data);
    return this.usersRepository.save(user);
  }

  async destroy(id: string) {
    await this.findOrFail(id);
    this.usersRepository.softDelete(id);
  }
}
