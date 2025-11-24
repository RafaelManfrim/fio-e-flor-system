import { Router } from 'express';
import { MaterialController } from '../controllers/MaterialController';

const materialRouter = Router();
const materialController = new MaterialController();

materialRouter.get('/', materialController.listar);
materialRouter.get('/:id', materialController.buscarPorId);
materialRouter.post('/', materialController.criar);
materialRouter.put('/:id', materialController.atualizar);
materialRouter.delete('/:id', materialController.deletar);

export { materialRouter };
