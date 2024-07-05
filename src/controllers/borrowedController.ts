import { Router, Request, Response } from 'express';
import { getBookFromDBWhereIsbnIs, getBorrowedBooksWhereUserIdIs, postNewBook } from '../seqModels';

class BorrowedController {
    router: Router;

    constructor() {
        this.router = Router();
        this.router.get('/:uid', this.getBooksCheckedOutBy.bind(this));
    }

    getBooksCheckedOutBy(req: Request, res: Response) {
		const userIdJson = req.params.uid
		getBorrowedBooksWhereUserIdIs(userIdJson).then(result => 
			res.json(result)
		)
	}
}

export default new BorrowedController().router;