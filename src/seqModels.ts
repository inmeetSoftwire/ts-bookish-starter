const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize("bookish", "InmKhu", "Ripcuscus123", {
  host: "CHOWCHOW",
  dialect: "mssql",
})

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
testConnection()

const Book = sequelize.define(
  'books',
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false
   
    },
    isbn: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    numOwnedByLibrary: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    timestamps: false
  }
);

export async function getBooksFromDB(): Promise<JSON> {
    const books = await Book.findAll()
    return books
}

export async function getBookFromDBWhereIsbnIs(isbn : number): Promise<JSON> {
  if (String(isbn).length != 13) {
    console.log(`${isbn} is not a valid ISBN`)
  } else {
    const book = await Book.findByPk(isbn)
    if (book == null) {
      console.log("Book not found in Library!")
    } else {
      return book;
    }
  }
}

export async function postNewBook(bookJson : JSON) {
	const book = await Book.create(bookJson)
}

const User = sequelize.define(
  'users',
  {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
   
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    }
  },
  {
    timestamps: false
  }
);

export async function getUsersFromDB(): Promise<JSON> {
    const users = await User.findAll()
    return users
}


const BorrowedBooks = sequelize.define(
	'borrowedBooks',
	{
	  userId: {
		type: DataTypes.STRING,
		allowNull: false
	  },
	  isbn: {
		type: DataTypes.STRING,
		allowNull: false
	 
	  },
	  checkoutId: {
		type: DataTypes.UUID,
		allowNull: false,
		primaryKey: true
	  }
	},
	{
	  timestamps: false
	}
);

export async function getBorrowedBooksWhereUserIdIs(uid : string) {
	const books = await BorrowedBooks.findAll({
		where: {
			userId: uid
		}
	})
	const bookArray: JSON[] = [];
	books.forEach(book => {
		getBookFromDBWhereIsbnIs(book.isbn)
	});
	return books
}
