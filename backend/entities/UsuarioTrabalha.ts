import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Profissao } from "./Profissao";
import { Usuario } from "./Usuario";

@Entity({ name: "usuario_trabalha" })
export class UsuarioTrabalha {
  @PrimaryGeneratedColumn("uuid", { name: "identificador" })
  readonly identificador!: string;

  @Column({ type: "boolean" })
  status!: boolean;

  @Column({ type: "varchar" })
  descricao!: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.vinculosProfissionais, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  @JoinColumn({
    name: "usuario_identificador",
    referencedColumnName: "identificador",
  })
  usuario!: Usuario;

  @ManyToOne(
    () => Profissao,
    (profissao) => profissao.vinculosUsuarios,
    { nullable: false, onDelete: "RESTRICT" },
  )
  @JoinColumn({
    name: "profissao_identificador",
    referencedColumnName: "identificador",
  })
  profissao!: Profissao;
}
