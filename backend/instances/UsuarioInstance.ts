import TypeOrm from "../config/AppDataSource";
import { CategoriaController, CidadeController, ProfissaoController, UsuarioController } from "../controllers";
import { CategoriaProfissional, Cidade, Profissao, Usuario, UsuarioTrabalha } from "../entities";
import { CategoriaProfissionalMapper } from "../mapper/CategoriaProfissionalMapper";
import { ProfissaoMapper } from "../mapper/ProfissaoMapper";
import { UsuarioMapper } from "../mapper/UsuarioMapper";
import { UsuarioTrabalhaMapper } from "../mapper/UsuarioTrabalhaMapper";
import { CategoriaProfissionalRepository, CidadeRepository, ProfissaoRepository, UsuarioRepository, UsuarioTrabalhaRepository } from "../repository";
import { CategoriaServiceImpl } from "../services/CategoriaServiceImpl";
import { CidadeServiceImpl } from "../services/CidadeServiceImpl";
import { ProfissaoService } from "../services/ProfissaoService";
import { UsuarioServiceImpl } from "../services/UsuarioServiceImpl";
import { UsuarioTrabalhaServiceImpl } from "../services/UsuarioTrabalhaServiceImpl";


const instanceAppDataSource = TypeOrm.obterInstancia().obterDataSource();

const instanceAppDataSourceRepositoryUsuario = instanceAppDataSource.getRepository(Usuario);
const instanceAppDataSourceRepositoryCidade = instanceAppDataSource.getRepository(Cidade);
const instanceAppDataSourceRepositoryCategoria = instanceAppDataSource.getRepository(CategoriaProfissional);
const instanceAppDataSourceRepositoryProfissao = instanceAppDataSource.getRepository(Profissao);
const instanceAppDataSourceRepositoryUsuarioTrabalha = instanceAppDataSource.getRepository(UsuarioTrabalha);




const instanceUsuarioRepository = new UsuarioRepository(instanceAppDataSourceRepositoryUsuario);
const instanceCidadeRepository = new CidadeRepository(instanceAppDataSourceRepositoryCidade);
const instanceCategoriaRepository = new CategoriaProfissionalRepository(instanceAppDataSourceRepositoryCategoria);
const instanceProfissaoRepository = new ProfissaoRepository(instanceAppDataSourceRepositoryProfissao);
const intanceUsuarioTrabalhaRepository = new UsuarioTrabalhaRepository(instanceAppDataSourceRepositoryUsuarioTrabalha);




const usuarioMapper = new UsuarioMapper();
const usuarioTrabalhaMapper = new UsuarioTrabalhaMapper();
const profissionalMapper = new ProfissaoMapper();
const categoriaProfissionalMapper = new CategoriaProfissionalMapper();


const instanceUsuarioTrabalhaService = new UsuarioTrabalhaServiceImpl(
    intanceUsuarioTrabalhaRepository,
    usuarioTrabalhaMapper
);

const instanceUsuarioService = new UsuarioServiceImpl(
            instanceUsuarioRepository,
            instanceCidadeRepository,
            instanceCategoriaRepository,
            instanceProfissaoRepository,
            instanceUsuarioTrabalhaService,
            usuarioMapper,
            categoriaProfissionalMapper,
            profissionalMapper
);


const instanceProfissaoService = new ProfissaoService(instanceProfissaoRepository);
const instanceCategoriaService = new CategoriaServiceImpl(instanceCategoriaRepository);
const instanceCidadeService = new CidadeServiceImpl(instanceCidadeRepository);


const instanceUsuarioController = new UsuarioController(instanceUsuarioService);
const instanceProfissaoController = new ProfissaoController(instanceProfissaoService);
const instanceCategoriaProfissionalController = new CategoriaController(instanceCategoriaService);
const instanceCidadeController = new CidadeController(instanceCidadeService);


export {
    instanceUsuarioController,
    instanceProfissaoController,
    instanceCategoriaProfissionalController,
    instanceCidadeController
}

   


  