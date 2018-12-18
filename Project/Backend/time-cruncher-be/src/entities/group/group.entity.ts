import {Entity, PrimaryGeneratedColumn, Column, ManyToMany} from 'typeorm';
import {User} from '../user/user.entity';

@Entity()
export class Group{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    type: "varchar",
    length: 50,
  })
  name: string;

  @Column({
    nullable: true,
    type: "varchar",
    length: 200,
  })
  description: string;

  @ManyToMany(type => User, user => user.groups, {nullable: false})
  users: User[];
}