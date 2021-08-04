import { Controller, Delete, Get, Put, Post, Param, Body } from '@nestjs/common'
import { User } from '../database/schema/user.schema'
import { UserService } from './user.service'
import { RegisterUserDTO, EditUserDTO } from './user.dto'
import { encryptPassword, makeSalt } from 'src/utils/crypto.util'
import { Response } from 'src/types'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // GET /user/users
  @Get('users')
  async findUsers(): Promise<Promise<Response<User[]>>> {
    return { data: await this.userService.findAll() }
  }

  // GET /user/:id
  @Get(':_id')
  async findUserById(@Param('_id') _id: string): Promise<Promise<Response<User>>> {
    return { data: await this.userService.findOne(_id)}
  }

  // POST /user/register
  @Post('register')
  async registerUser(@Body() body: RegisterUserDTO): Promise<Response> {
    const { username, password } = body
    const user = await this.userService.findOneByUsername(username)
    if (user) return { code: 400, message: '用户已存在' }

    const salt = makeSalt()
    await this.userService.create({
      ...body,
      password: encryptPassword(password, salt),
      passwordSalt: salt,
    })
    return { message: '注册成功.' }
  }

  // Put /user/:id
  @Put(':_id')
  async updateUser(
    @Param('_id') _id: string,
    @Body() body: EditUserDTO,
  ): Promise<Response> {
    await this.userService.update(_id, body)
    return { message: '编辑成功.' }
  }

  // delete /user/:id
  @Delete(':_id')
  async deleteUser(@Param('_id') _id: string): Promise<Response> {
    await this.userService.delete(_id)
    return { message: '删除成功.' }
  }
}
