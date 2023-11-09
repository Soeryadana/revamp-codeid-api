import { Column, Entity, Index, JoinColumn, OneToOne } from "typeorm";
import { Batch } from "./Batch";

@Index("instructor_programs_batch_id_pkey", ["batchId"], { unique: true })
@Entity("instructor_programs", { schema: "bootcamp" })
export class InstructorPrograms {
  @Column("integer", { primary: true, name: "batch_id" })
  batchId: number;

  @Column("timestamp without time zone", {
    name: "inpro_modified_date",
    nullable: true,
  })
  inproModifiedDate: Date | null;

  @Column("character varying", {
    name: "inpro_first_name",
    nullable: true,
    length: 50,
  })
  inproFirstName: string | null;

  @Column("character varying", {
    name: "inpro_last_name",
    nullable: true,
    length: 50,
  })
  inproLastName: string | null;

  @Column("character varying", {
    name: "inpro_photo",
    nullable: true,
    length: 255,
  })
  inproPhoto: string | null;

  @OneToOne(() => Batch, (batch) => batch.instructorPrograms)
  @JoinColumn([{ name: "batch_id", referencedColumnName: "batchId" }])
  batch: Batch;
}
