import { Column, Entity, Index, OneToMany } from "typeorm";
import { SkillTemplate } from "./SkillTemplate";

@Index("skil_type_pkey", ["sktyName"], { unique: true })
@Entity("skill_type", { schema: "master" })
export class SkillType {
  @Column("character varying", { primary: true, name: "skty_name", length: 55 })
  sktyName: string;

  @OneToMany(() => SkillTemplate, (skillTemplate) => skillTemplate.sktyName)
  skillTemplates: SkillTemplate[];
}
