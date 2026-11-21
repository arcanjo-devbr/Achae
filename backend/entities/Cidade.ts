import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Usuario } from "./Usuario";

@Entity({ name: "cidade" })
export class Cidade {
  @PrimaryColumn({ type: "integer", name: "identificador" })
  readonly identificador!: number;

  @Column({ type: "varchar", unique: true })
  readonly nome!: string;

  @OneToMany(() => Usuario, (usuario) => usuario.cidade)
  readonly usuarios!: Usuario[];
}
