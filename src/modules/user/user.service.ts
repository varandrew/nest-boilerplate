import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User } from '../database/schema/user.schema'
import { CreateUserDTO, EditUserDTO } from './user.dto'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  // 查找用户
  async findAll(): Promise<User[]> {
    const users = await this.userModel.find().exec()
    return users
  }

  // 查找单个用户
  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id)
    return user
  }

  async findOneByUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({ username }).exec()
    return user
  }

  // 添加用户
  async create(user: CreateUserDTO): Promise<void> {
    await this.userModel.create(user)
  }

  // 编辑用户
  async update(id: string, user: EditUserDTO): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, user)
  }

  // 删除用户
  async delete(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id)
  }
}
