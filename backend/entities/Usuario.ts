import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Cidade } from "./Cidade";
import { UsuarioTrabalha } from "./UsuarioTrabalha";

@Entity({ name: "usuario" })
export class Usuario {
  @PrimaryGeneratedColumn("uuid", { name: "identificador" })
  readonly identificador!: string;

  @Column({ type: "varchar", unique: true })
  nome!: string;

  @Column({ type: "varchar" })
  telefone!: string;

  @ManyToOne(() => Cidade, (cidade) => cidade.usuarios, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  @JoinColumn({
    name: "cidade_identificador",
    referencedColumnName: "identificador",
  })
  cidade!: Cidade;

  @OneToMany(
    () => UsuarioTrabalha,
    (vinculo) => vinculo.usuario,
  )
  vinculosProfissionais!: UsuarioTrabalha[];
}
