import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersEntity } from './user.entity';
import { NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UsersEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });
});
describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: Repository<UsersEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UsersEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<UsersEntity>>(getRepositoryToken(UsersEntity));
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('deve retornar uma lista de usuários', async () => {
      const users: UsersEntity[] = [
        { id: '1', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', password: 'hashedpassword1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), deletedAt: new Date().toISOString(), hasPassword: jest.fn() },
        { id: '2', firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com', password: 'hashedpassword2', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), deletedAt: new Date().toISOString(), hasPassword: jest.fn() },
      ];

      jest.spyOn(usersRepository, 'find').mockResolvedValue(users);

      const result = await service.findAll();
      expect(result).toEqual(users);
      expect(usersRepository.find).toHaveBeenCalledWith({ select: ['id', 'firstName', 'lastName', 'email'] });
    });
  });

  describe('findOrFail', () => {
    it('deve retornar um usuário se encontrado', async () => {
      const id = '1';
      const user: UsersEntity = { id, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', password: 'hashedpassword1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), deletedAt: new Date().toISOString(), hasPassword: jest.fn() };

      jest.spyOn(usersRepository, 'findOneOrFail').mockResolvedValue(user);

      const result = await service.findOrFail(id);
      expect(result).toEqual(user);
      expect(usersRepository.findOneOrFail).toHaveBeenCalledWith({ where: { id } });
    });

    it('deve lançar NotFoundException se o usuário não for encontrado', async () => {
      const id = '1';

      jest.spyOn(usersRepository, 'findOneOrFail').mockRejectedValue(new Error('User not found'));

      await expect(service.findOrFail(id)).rejects.toThrow(NotFoundException);
      expect(usersRepository.findOneOrFail).toHaveBeenCalledWith({ where: { id } });
    });
  });

  describe('store', () => {
    it('deve criar e salvar um novo usuário', async () => {
      const createUserDto: CreateUserDto = { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', password: 'password123' };
      const user: UsersEntity = { id: '1', ...createUserDto, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), deletedAt: new Date().toISOString(), hasPassword: jest.fn() };

      jest.spyOn(usersRepository, 'create').mockReturnValue(user);
      jest.spyOn(usersRepository, 'save').mockResolvedValue(user);

      const result = await service.store(createUserDto);
      expect(result).toEqual(user);
      expect(usersRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(usersRepository.save).toHaveBeenCalledWith(user);
    });
  });

  describe('update', () => {
    it('deve atualizar um usuário com sucesso', async () => {
      const id = '1';
      const updateUserDto: UpdateUserDto = { firstName: 'John', lastName: 'Doe' };
      const user = { id, ...updateUserDto };

      jest.spyOn(service, 'findOrFail').mockResolvedValue(user as UsersEntity);
      jest.spyOn(usersRepository, 'merge').mockReturnValue(user as UsersEntity);
      jest.spyOn(usersRepository, 'save').mockResolvedValue(user as UsersEntity);

      const result = await service.update(id, updateUserDto);
      expect(result).toEqual(user);
      expect(service.findOrFail).toHaveBeenCalledWith(id);
      expect(usersRepository.merge).toHaveBeenCalledWith(user, updateUserDto);
      expect(usersRepository.save).toHaveBeenCalledWith(user);
    });

    it('deve lançar NotFoundException se o usuário não for encontrado', async () => {
      const id = '1';
      const updateUserDto: UpdateUserDto = { firstName: 'John', lastName: 'Doe' };

      jest.spyOn(service, 'findOrFail').mockRejectedValue(new NotFoundException('User not found'));
      jest.spyOn(usersRepository, 'softDelete').mockResolvedValue({ affected: 0 } as any);
      jest.spyOn(usersRepository, 'softDelete').mockResolvedValue({ affected: 0 } as any);

      await expect(service.update(id, updateUserDto)).rejects.toThrow(NotFoundException);
      expect(service.findOrFail).toHaveBeenCalledWith(id);
    });
  });

  describe('destroy', () => {
    it('deve excluir um usuário com sucesso', async () => {
      const id = '1';
      const user: UsersEntity = { id, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', password: 'hashedpassword1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), deletedAt: new Date().toISOString(), hasPassword: jest.fn() };

      jest.spyOn(service, 'findOrFail').mockResolvedValue(user);
      jest.spyOn(usersRepository, 'softDelete').mockResolvedValue({ affected: 1 } as any);

      await service.destroy(id);
      expect(service.findOrFail).toHaveBeenCalledWith(id);
      expect(usersRepository.softDelete).toHaveBeenCalledWith(id);
    });

    it('deve lançar NotFoundException se o usuário não for encontrado', async () => {
      const id = '1';

      jest.spyOn(service, 'findOrFail').mockRejectedValue(new NotFoundException('Usuário não encontrado'));

      await expect(service.destroy(id)).rejects.toThrow(NotFoundException);
      expect(service.findOrFail).toHaveBeenCalledWith(id);
    });
  });
});
