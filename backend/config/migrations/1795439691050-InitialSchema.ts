import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1795439691050 implements MigrationInterface {
    name = 'InitialSchema1795439691050'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categoria_profissional" ("identificador" integer NOT NULL, "nome" character varying NOT NULL, "categoria" character varying NOT NULL, CONSTRAINT "UQ_492cc5f130c220a87b3624c6c33" UNIQUE ("nome"), CONSTRAINT "UQ_48702cd9d79dfed415ef6b90880" UNIQUE ("categoria"), CONSTRAINT "PK_567abac0f1ec071e7ae988d0a37" PRIMARY KEY ("identificador"))`);
        await queryRunner.query(`CREATE TABLE "profissao" ("identificador" integer NOT NULL, "nome" character varying NOT NULL, "especialidade" character varying NOT NULL, "categoria_profissional_identificador" integer NOT NULL, CONSTRAINT "UQ_129b70e1546a6f694b80986a50f" UNIQUE ("nome"), CONSTRAINT "UQ_1c3b259478bdb35a7325b12a1ad" UNIQUE ("especialidade"), CONSTRAINT "PK_6b8d8f5b1980436752b87886df1" PRIMARY KEY ("identificador"))`);
        await queryRunner.query(`CREATE TABLE "usuario_trabalha" ("identificador" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" boolean NOT NULL, "descricao" character varying NOT NULL, "usuario_identificador" uuid NOT NULL, "profissao_identificador" integer NOT NULL, CONSTRAINT "PK_611022737be9b506b48b18a1fec" PRIMARY KEY ("identificador"))`);
        await queryRunner.query(`CREATE TABLE "usuario" ("identificador" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome" character varying NOT NULL, "telefone" character varying NOT NULL, "cidade_identificador" integer NOT NULL, CONSTRAINT "UQ_aa7d78895f0998f84649d3902c3" UNIQUE ("nome"), CONSTRAINT "PK_ffb8a97f69dbe942e07949dc36f" PRIMARY KEY ("identificador"))`);
        await queryRunner.query(`CREATE TABLE "cidade" ("identificador" integer NOT NULL, "nome" character varying NOT NULL, CONSTRAINT "UQ_1caefa7e87cb9a7b99524f5acd6" UNIQUE ("nome"), CONSTRAINT "PK_1f34fce3dda30b868f25046cb6a" PRIMARY KEY ("identificador"))`);
        await queryRunner.query(`ALTER TABLE "profissao" ADD CONSTRAINT "FK_4ee90b986adfaf9cf1edde4e8f1" FOREIGN KEY ("categoria_profissional_identificador") REFERENCES "categoria_profissional"("identificador") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "usuario_trabalha" ADD CONSTRAINT "FK_8cffc004b98948d480e7839bc25" FOREIGN KEY ("usuario_identificador") REFERENCES "usuario"("identificador") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "usuario_trabalha" ADD CONSTRAINT "FK_95b4577a91ca08392704801ffba" FOREIGN KEY ("profissao_identificador") REFERENCES "profissao"("identificador") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "usuario" ADD CONSTRAINT "FK_877cc4241ef5aa8b9d890c25919" FOREIGN KEY ("cidade_identificador") REFERENCES "cidade"("identificador") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuario" DROP CONSTRAINT "FK_877cc4241ef5aa8b9d890c25919"`);
        await queryRunner.query(`ALTER TABLE "usuario_trabalha" DROP CONSTRAINT "FK_95b4577a91ca08392704801ffba"`);
        await queryRunner.query(`ALTER TABLE "usuario_trabalha" DROP CONSTRAINT "FK_8cffc004b98948d480e7839bc25"`);
        await queryRunner.query(`ALTER TABLE "profissao" DROP CONSTRAINT "FK_4ee90b986adfaf9cf1edde4e8f1"`);
        await queryRunner.query(`DROP TABLE "cidade"`);
        await queryRunner.query(`DROP TABLE "usuario"`);
        await queryRunner.query(`DROP TABLE "usuario_trabalha"`);
        await queryRunner.query(`DROP TABLE "profissao"`);
        await queryRunner.query(`DROP TABLE "categoria_profissional"`);
    }

}
