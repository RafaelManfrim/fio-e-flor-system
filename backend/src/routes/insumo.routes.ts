import { Router } from 'express';
import { InsumoController } from '../controllers/InsumoController';

const insumoRouter = Router();
const insumoController = new InsumoController();

insumoRouter.get('/', insumoController.listar);
insumoRouter.get('/:id', insumoController.buscarPorId);
insumoRouter.post('/', insumoController.criar);
insumoRouter.put('/:id', insumoController.atualizar);
insumoRouter.delete('/:id', insumoController.deletar);

export { insumoRouter };
