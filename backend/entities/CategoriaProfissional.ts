import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Profissao } from "./Profissao";

@Entity({ name: "categoria_profissional" })
export class CategoriaProfissional {
  @PrimaryColumn({ type: "integer", name: "identificador" })
  readonly identificador!: number;

  @Column({ type: "varchar", unique: true })
  readonly categoria!: string;

  @OneToMany(
    () => Profissao,
    (profissao) => profissao.categoriaProfissional,
  )
  readonly profissoes!: Profissao[];
}
