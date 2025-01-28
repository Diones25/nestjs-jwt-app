import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersEntity } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn(),
            store: jest.fn(),
            findOrFail: jest.fn(),
            update: jest.fn(),
            destroy: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('deve ser definido', () => {
    expect(controller).toBeDefined();
  });

  describe('index', () => {
    it('deve retornar uma lista de usuários', async () => {
      const result = [new UsersEntity()];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.index()).toBe(result);
    });

    it('deve chamar o método findAll do serviço', async () => {
      const findAllSpy = jest.spyOn(service, 'findAll').mockResolvedValue([new UsersEntity()]);

      await controller.index();
      expect(findAllSpy).toHaveBeenCalled();
    });
  });

  describe('store', () => {
    it('deve criar um novo usuário', async () => {
      const createUserDto: CreateUserDto = { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', password: 'password123' };
      const result = new UsersEntity();
      jest.spyOn(service, 'store').mockResolvedValue(result);

      expect(await controller.store(createUserDto)).toBe(result);
    });
  });

  describe('show', () => {
    it('deve retornar um usuário pelo ID', async () => {
      const result = new UsersEntity();
      jest.spyOn(service, 'findOrFail').mockResolvedValue(result);

      expect(await controller.show('1')).toBe(result);
    });

    it('deve lançar NotFoundException se o usuário não for encontrado', async () => {
      jest.spyOn(service, 'findOrFail').mockRejectedValue(new NotFoundException());

      await expect(controller.show('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('deve atualizar um usuário', async () => {
      const updateUserDto: UpdateUserDto = { firstName: 'John', lastName: 'Doe' };
      const result = new UsersEntity();
      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update('1', updateUserDto)).toBe(result);
    });
  });

  describe('destroy', () => {
    it('deve excluir um usuário', async () => {
      jest.spyOn(service, 'destroy').mockResolvedValue(undefined);

      expect(await controller.destroy('1')).toBeUndefined();
    });
  });
});
