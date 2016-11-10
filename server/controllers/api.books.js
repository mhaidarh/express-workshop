// LEGACY DATA WITH JSON
const books = require('../data/books')

// DATA WITH MONGOOSE MODEL
const Book = require('../models/books')

// -----------------------------------------------------------------------------
// CONTROLLING
// -----------------------------------------------------------------------------

module.exports = {

  /*
   * @api {get} /books/seed Seed some books
   * @apiName seedBooks
   * @apiGroup Books
   */
  seedBooks: (req, res) => {
    const books = [
      {
        isbn: 1000,
        name: 'One Only',
        price: 11,
        owners: [1, 3]
      },
      {
        isbn: 2000,
        name: 'Two Times',
        price: 22,
        owners: [2, 3]
      },
      {
        isbn: 3000,
        name: 'Three Trees',
        price: 33,
        owners: [3]
      }
    ]
    Book
      .create(books, (err, data) => {
        console.log('seedBooks:', data)
        if (err) res.status(400).json(err)
        else if (!data) res.status(304).json({ 'message': 'Failed to seed books' })
        else res.status(200).json(data)
      })
  },

  /*
   * @api {get} /books Get all books
   * @apiName getBooks
   * @apiGroup Books
   *
   * @apiSuccess {Number} isbn  Book ISBN (international standard book number)
   * @apiSuccess {String} name  Book title
   * @apiSuccess {Number} price Book retail price
   */
  getBooks: (req, res) => {
    Book
      .find()
      .exec((err, data) => {
        // console.log('getBooks:', data)
        if (err) res.status(400).json({ 'error': `Error: ${err}` })
        else if (!data) res.status(404).json({ 'message': 'Failed to get all books' })
        else res.status(200).json(data)
      })
  },

  /*
   * @api {get} /books Delete all books
   * @apiName deleteBooks
   * @apiGroup Books
   *
   * @apiParam {Number} isbn
   *
   * @apiSuccess {JSON} message All books have been deleted
   */
  deleteBooks: (req, res) => {
    Book
      .remove()
      .exec((err, data) => {
        // console.log('deleteBooks:', data)
        if (err) res.status(400).json({ 'error': `Error: ${err}` })
        else if (!data) res.status(404).json({ 'message': 'Already empty' })
        else res.status(200).json({ 'message': `All books have been deleted` })
      })
  },

  /*
   * @api {post} /books Post a new book
   * @apiName postBooks
   * @apiGroup Books
   *
   * @apiParams {Number} isbn  Book ISBN
   * @apiParams {String} name  Book title
   * @apiParams {Number} price Book retail price
   *
   * @apiSuccess {JSON} isbn, name, price
   */
  postBook: (req, res) => {
    const book = {
      isbn: req.body.isbn,
      name: req.body.name,
      price: req.body.price
    }
    Book
      .create(book, (err, data) => {
        console.log('postBook:', data)
        if (err) res.status(400).json(err)
        else if (!data) res.status(304).json({ 'message': 'Failed to post book with that data' })
        else res.status(200).json(data)
      })
  },

  /*
   * @api {post} /books Post a new book with owner data
   */
  postBookAndOwner: (req, res) => {
    const book = {
      isbn: req.body.isbn,
      name: req.body.name,
      price: req.body.price,
      owners: req.body.owner // accountId
    }
    console.log('book:', book)

    Book.create(book, (err, data) => {
      console.log('postBookWithOwner:', data)
      if (err) res.status(400).json(err)
      else if (!data) res.status(304).json({ 'message': 'Failed to post book with that data and ownership' })
      else res.status(200).json(data)
    })
  },

  /*
   * @api {post} /books/search Search some books
   * @apiName searchBooks
   * @apiGroup Books
   *
   * @apiParams {Number} isbn  Book ISBN
   *
   * @apiSuccess {JSON} isbn, name, price
   */
  searchBooks: (req, res) => {
    const params = {}
    if (req.body.isbn) params.isbn = req.body.isbn
    if (req.body.name) params.name = req.body.name

    Book.find(params, (err, data) => {
      console.log('searchBooks:', data)
      if (err) return res.status(500).send(err)
      else if (err) res.status(400).json({ 'error': `Error: ${err}` })
      else if (!data) res.status(304).json({ 'message': `Failed to search books with params: ${params}` })
      else res.json(data)
    })
  },

  /*
   * @api {get} /books/:isbn Get book by ISBN
   * @apiName getBookByISBN
   * @apiGroup Books
   *
   * @apiParams {String} isbn   Book id is ISBN
   *
   * @apiSuccess {Number} isbn  Book ISBN
   * @apiSuccess {String} name  Book title
   * @apiSuccess {Number} price Book retail price
   */
  getBookByISBN: (req, res) => {
    Book.findOne({
      isbn: req.params.isbn
    }, (err, data) => {
      console.log('getBookByISBN:', data)
      if (err) res.status(400).json({ 'error': `Error: ${err}` })
      else if (!data) res.status(404).json({ 'message': 'Failed to get book by ISBN' })
      else res.status(200).json(data)
    })
  },

  /*
   * @api {delete} /books/:isbn Delete book by ISBN
   * @apiName deleteBookByISBN
   * @apiGroup Books
   *
   * @apiParams {String} isbn   Book id is ISBN
   *
   * @apiSuccess {JSON} message Book ISBN has been deleted
   */
  deleteBookByISBN: (req, res) => {
    Book.findOneAndRemove({
      isbn: req.params.isbn
    }, (err, data) => {
      console.log('deleteBookByISBN:', data)
      if (err) res.status(400).json({ 'error': `Error: ${err}` })
      else if (!data) res.status(404).json({ 'message': 'No book found' })
      else res.status(200).json({ 'message': `Book ${req.params.isbn} has been deleted` })
    })
  },

  /*
   * @api {put} /books/:isbn Update book by ISBN
   * @apiName updateBookByISBN
   * @apiGroup Books
   *
   * @apiParams {Number} isbn  Book ISBN
   * @apiParams {String} name  Book title
   * @apiParams {Number} price Book retail price
   *
   * @apiSuccess {JSON} isbn, name, price
   */
  updateBookByISBN: (req, res) => {
    Book.findOneAndUpdate({
      isbn: req.params.isbn
    }, {
      isbn: req.body.isbn,
      name: req.body.name,
      price: req.body.price
    }, {
      new: true,
      upsert: true
    }, (err, data) => {
      console.log('updateBookByISBN:', data)
      if (err) res.status(400).json({ 'error': `Error: ${err}` })
      else if (!data) res.status(404).json({ 'message': 'Failed to update book by ISBN' })
      else res.status(200).json(data)
    })
  },

  /*
   * @api {put} /books/:isbn/owner Update book by ISBN to put with owner accountId
   * @apiName updateBookByISBNAndOwner
   * @apiGroup Books
   */

  updateBookByISBNAndOwner: (req, res) => {
    Book.findOneAndUpdate({
      isbn: req.params.isbn
    }, {
      $push: { 'owners': req.body.owner }
    }, {
      new: true,
      upsert: false
    }, (err, data) => {
      console.log('updateBookByISBNAndOwner:', data)
      if (err) res.status(400).json({ 'error': `Error: ${err}` })
      else if (!data) res.status(404).json({ 'message': 'Failed to update book by ISBN and push owner accountId' })
      else res.status(200).json(data)
    })
  }

}
