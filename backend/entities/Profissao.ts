import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
import { CategoriaProfissional } from "./CategoriaProfissional";
import { UsuarioTrabalha } from "./UsuarioTrabalha";

@Entity({ name: "profissao" })
export class Profissao {
  @PrimaryColumn({ type: "integer", name: "identificador" })
  readonly identificador!: number;

  @Column({ type: "varchar", unique: true })
  readonly nome!: string;

  @Column({ type: "varchar", unique: true })
  readonly especialidade!: string;


  @ManyToOne(
    () => CategoriaProfissional,
    (categoriaProfissional) => categoriaProfissional.profissoes,
    { nullable: false, onDelete: "RESTRICT" },
  )
  @JoinColumn({
    name: "categoria_profissional_identificador",
    referencedColumnName: "identificador",
  })
  readonly categoriaProfissional!: CategoriaProfissional;

  @OneToMany(
    () => UsuarioTrabalha,
    (usuarioTrabalha) => usuarioTrabalha.profissao,
  )
  readonly vinculosUsuarios!: UsuarioTrabalha[];
}
