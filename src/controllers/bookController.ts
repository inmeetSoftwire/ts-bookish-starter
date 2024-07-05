import { Router, Request, Response } from 'express';
import { getBookFromDBWhereIsbnIs, getBorrowedBooksWhereUserIdIs, postNewBook } from '../seqModels';

class BookController {
    router: Router;

    constructor() {
        this.router = Router();
        this.router.get('/:id', this.getBook.bind(this));

        this.router.post('/', this.createBook.bind(this));
    }

    getBook(req: Request, res: Response) {
        const isbn : number = parseInt(req.params.id)
        getBookFromDBWhereIsbnIs(isbn).then(result => {
            return res.json(result)
        })
    }

    createBook(req: Request, res: Response) {
        // TODO: implement functionality
        const bookJson: JSON = req.body
		console.log(bookJson)
		try {
			postNewBook(bookJson)
			res.status(201)
		} catch (err) {
			res.send(err)
		}
		
    }

	getBooksCheckedOutBy(req: Request, res: Response) {
		const userIdJson = req.body
		getBorrowedBooksWhereUserIdIs(userIdJson).then(result => 
			res.json(result)
		 )
	}
}

export default new BookController().router;
