import { Document } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'


@Schema()
export class User extends Document {
  @Prop({ required: true })
  @ApiProperty({
    description: '用户名',
    example: '17600000000',
  })
  readonly username: string

  @Prop({ required: true, select: false })
  @ApiProperty({
    description: '用户密码',
    example: 'test_password',
  })
  readonly password: string

  @Prop({ required: true, select: false })
  readonly passwordSalt: string

  @Prop()
  readonly name: string

  @Prop()
  readonly phone: string

  @Prop({ select: false })
  __v: number
}

export const UserSchema = SchemaFactory.createForClass(User)
