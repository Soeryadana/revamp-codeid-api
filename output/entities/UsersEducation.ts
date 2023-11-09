import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./Users";

@Index("fki_ususer", ["usduEntityId"], {})
@Index("fki_usdu_user_id_fk", ["usduEntityId"], {})
@Index("fki_users_education_fkey", ["usduEntityId"], {})
@Index("fki_users_education_pkey", ["usduEntityId"], {})
@Index("fki_users_entity_fkey", ["usduEntityId"], {})
@Index("users_education_pkey", ["usduId"], { unique: true })
@Entity("users_education", { schema: "users" })
export class UsersEducation {
  @PrimaryGeneratedColumn({ type: "integer", name: "usdu_id" })
  usduId: number;

  @Column("character varying", {
    name: "usdu_school",
    nullable: true,
    length: 50,
  })
  usduSchool: string | null;

  @Column("character varying", {
    name: "usdu_degree",
    nullable: true,
    length: 50,
  })
  usduDegree: string | null;

  @Column("character varying", {
    name: "usdu_field_study",
    nullable: true,
    length: 50,
  })
  usduFieldStudy: string | null;

  @Column("timestamp without time zone", {
    name: "usdu_modified_date",
    nullable: true,
  })
  usduModifiedDate: Date | null;

  @Column("integer", { name: "usdu_entity_id", nullable: true })
  usduEntityId: number | null;

  @ManyToOne(() => Users, (users) => users.usersEducations, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([
    { name: "usdu_entity_id", referencedColumnName: "userEntityId" },
  ])
  usduEntity: Users;
}
