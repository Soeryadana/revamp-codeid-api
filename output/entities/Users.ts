import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ProgramApply } from "./ProgramApply";
import { ProgramApplyProgress } from "./ProgramApplyProgress";
import { ProgramReviews } from "./ProgramReviews";
import { UsersEducation } from "./UsersEducation";

@Index("users_pkey", ["userEntityId"], { unique: true })
@Entity("users", { schema: "users" })
export class Users {
  @PrimaryGeneratedColumn({ type: "integer", name: "user_entity_id" })
  userEntityId: number;

  @Column("character varying", {
    name: "user_name",
    nullable: true,
    length: 15,
  })
  userName: string | null;

  @Column("character varying", {
    name: "user_password",
    nullable: true,
    length: 255,
  })
  userPassword: string | null;

  @Column("character varying", {
    name: "user_first_name",
    nullable: true,
    length: 50,
  })
  userFirstName: string | null;

  @Column("character varying", {
    name: "user_last_name",
    nullable: true,
    length: 50,
  })
  userLastName: string | null;

  @Column("timestamp without time zone", {
    name: "user_birth_date",
    nullable: true,
  })
  userBirthDate: Date | null;

  @Column("character varying", {
    name: "user_email",
    nullable: true,
    length: 50,
  })
  userEmail: string | null;

  @Column("character varying", {
    name: "user_photo",
    nullable: true,
    length: 255,
  })
  userPhoto: string | null;

  @Column("character varying", {
    name: "user_phone",
    nullable: true,
    length: 15,
  })
  userPhone: string | null;

  @Column("character varying", { name: "user_cv", nullable: true, length: 255 })
  userCv: string | null;

  @OneToMany(() => ProgramApply, (programApply) => programApply.prapUserEntity)
  programApplies: ProgramApply[];

  @OneToMany(
    () => ProgramApplyProgress,
    (programApplyProgress) => programApplyProgress.parogUserEntity
  )
  programApplyProgresses: ProgramApplyProgress[];

  @OneToMany(
    () => ProgramReviews,
    (programReviews) => programReviews.prowUserEntity
  )
  programReviews: ProgramReviews[];

  @OneToMany(
    () => UsersEducation,
    (usersEducation) => usersEducation.usduEntity
  )
  usersEducations: UsersEducation[];
}
