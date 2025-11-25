import { Router } from 'express';
import { VendaController } from '../controllers/VendaController';

const vendaRouter = Router();
const vendaController = new VendaController();

vendaRouter.get('/', vendaController.listar);
vendaRouter.get('/estatisticas', vendaController.estatisticas);
vendaRouter.get('/relatorio', vendaController.relatorio);
vendaRouter.get('/:id', vendaController.buscarPorId);
vendaRouter.post('/', vendaController.criar);
vendaRouter.delete('/:id', vendaController.deletar);

export { vendaRouter };
