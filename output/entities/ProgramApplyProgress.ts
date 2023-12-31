import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ProgramEntity } from "./ProgramEntity";
import { RouteActions } from "./RouteActions";
import { Status } from "./Status";
import { Users } from "./Users";

@Index(
  "program_apply_progress_pk",
  ["parogId", "parogProgEntityId", "parogUserEntityId"],
  { unique: true }
)
@Index(
  "fki_program_apply_progress_parog_user_entity_id_fkey",
  ["parogUserEntityId"],
  {}
)
@Entity("program_apply_progress", { schema: "bootcamp" })
export class ProgramApplyProgress {
  @PrimaryGeneratedColumn({ type: "integer", name: "parog_id" })
  parogId: number;

  @Column("integer", { primary: true, name: "parog_user_entity_id" })
  parogUserEntityId: number;

  @Column("integer", { primary: true, name: "parog_prog_entity_id" })
  parogProgEntityId: number;

  @Column("timestamp without time zone", {
    name: "parog_action_date",
    nullable: true,
  })
  parogActionDate: Date | null;

  @Column("timestamp without time zone", {
    name: "parog_modified_date",
    nullable: true,
  })
  parogModifiedDate: Date | null;

  @Column("character varying", {
    name: "parog_comment",
    nullable: true,
    length: 512,
  })
  parogComment: string | null;

  @Column("character varying", {
    name: "parog_progress_name",
    nullable: true,
    length: 15,
  })
  parogProgressName: string | null;

  @ManyToOne(
    () => ProgramEntity,
    (programEntity) => programEntity.programApplyProgresses
  )
  @JoinColumn([
    { name: "parog_prog_entity_id", referencedColumnName: "progEntityId" },
  ])
  parogProgEntity: ProgramEntity;

  @ManyToOne(
    () => RouteActions,
    (routeActions) => routeActions.programApplyProgresses
  )
  @JoinColumn([{ name: "parog_roac_id", referencedColumnName: "roacId" }])
  parogRoac: RouteActions;

  @ManyToOne(() => Status, (status) => status.programApplyProgresses)
  @JoinColumn([{ name: "parog_status", referencedColumnName: "status" }])
  parogStatus: Status;

  @ManyToOne(() => Users, (users) => users.programApplyProgresses)
  @JoinColumn([
    { name: "parog_user_entity_id", referencedColumnName: "userEntityId" },
  ])
  parogUserEntity: Users;
}
