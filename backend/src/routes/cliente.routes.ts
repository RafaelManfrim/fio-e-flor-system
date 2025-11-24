import { Router } from 'express';
import { ClienteController } from '../controllers/ClienteController';

const clienteRouter = Router();
const clienteController = new ClienteController();

clienteRouter.get('/', clienteController.listar);
clienteRouter.get('/:id', clienteController.buscarPorId);
clienteRouter.post('/', clienteController.criar);
clienteRouter.put('/:id', clienteController.atualizar);
clienteRouter.delete('/:id', clienteController.deletar);

export { clienteRouter };
