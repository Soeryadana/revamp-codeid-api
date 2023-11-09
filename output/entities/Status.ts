import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Batch } from "./Batch";
import { ProgramApply } from "./ProgramApply";
import { ProgramApplyProgress } from "./ProgramApplyProgress";
import { ProgramEntity } from "./ProgramEntity";
import { Modules } from "./Modules";

@Index("status_pkey", ["status"], { unique: true })
@Entity("status", { schema: "master" })
export class Status {
  @Column("character varying", { primary: true, name: "status", length: 15 })
  status: string;

  @Column("timestamp without time zone", {
    name: "status_modified_date",
    nullable: true,
  })
  statusModifiedDate: Date | null;

  @OneToMany(() => Batch, (batch) => batch.batchStatus)
  batches: Batch[];

  @OneToMany(() => ProgramApply, (programApply) => programApply.prapStatus)
  programApplies: ProgramApply[];

  @OneToMany(
    () => ProgramApplyProgress,
    (programApplyProgress) => programApplyProgress.parogStatus
  )
  programApplyProgresses: ProgramApplyProgress[];

  @OneToMany(() => ProgramEntity, (programEntity) => programEntity.progStatus)
  programEntities: ProgramEntity[];

  @ManyToOne(() => Modules, (modules) => modules.statuses)
  @JoinColumn([{ name: "status_module", referencedColumnName: "moduleName" }])
  statusModule: Modules;
}
