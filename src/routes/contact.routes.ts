import { Router } from 'express';
import { ContactController } from '../controllers/contact.controller';

const router = Router();
const contactController = new ContactController();

router.post('/', contactController.createContact.bind(contactController));
router.get('/:id', contactController.getContact.bind(contactController));

export default router;
