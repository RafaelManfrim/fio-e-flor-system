import { Router } from 'express';
import { ProdutoController } from '../controllers/ProdutoController';

const produtoRouter = Router();
const produtoController = new ProdutoController();

produtoRouter.get('/', produtoController.listar);
produtoRouter.get('/:id', produtoController.buscarPorId);
produtoRouter.post('/', produtoController.criar);
produtoRouter.put('/:id', produtoController.atualizar);
produtoRouter.delete('/:id', produtoController.deletar);

export { produtoRouter };
