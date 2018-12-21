import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../user/user.entity';
import { Group } from '../group/group.entity';

@Entity()
export class Task{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  description: string;

  @Column({
    type: 'datetime',
    nullable: false,
  })
  publishTime: string;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  dueTime: string;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  completionTime: string;

  @Column({
    type: 'tinyint',
    nullable: false,
  })
  isCompleted: boolean;

  @ManyToOne(type => User, user => user.createdTasks, {onDelete: 'CASCADE'})
  @JoinColumn()
  creator: number;

  @ManyToOne(type => Group, group => group.tasks)
  @JoinColumn()
  group: number;

  @ManyToMany(type => User, user => user.assignedTasks)
  assignedUsers: User[];
}