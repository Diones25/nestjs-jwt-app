import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
import { UsersEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>
  ) { }
  
  async findAll(): Promise<UsersEntity[]> {
    return this.usersRepository.find({ select: ['id', 'firstName', 'lastName', 'email'] });
  }

  async findOrFail(options: FindOneOptions<UsersEntity> = {}): Promise<UsersEntity> {
    try {
      return await this.usersRepository.findOneOrFail(options);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async update(id: string, data: Partial<UsersEntity>): Promise<UsersEntity> {
    const user = await this.findOrFail({ where: { id } });
    this.usersRepository.merge(user, data);
    return this.usersRepository.save(user);
  }

  async destroy(id: string) {
    await this.findOrFail({ where: { id } });
    this.usersRepository.softDelete(id);
  }
}
