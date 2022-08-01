'use strict'

const STORAGE_KEY = 'bookDB'
const BOOKS_PER_PAGE = 8
const gBooksTitle = [
    'A Tale of Two Cities',
    'The Little Prince',
    `Harry Potter and the Philosopher's Stone`,
    'And Then There Were None',
    'Dream of the Red Chamber',
    'The Hobbit',
    'The Lion, the Witch and the Wardrobe',
    'She: A History of Adventure',
    'The Da Vinci Code',
    'Harry Potter and the Chamber of Secrets',
    'The Alchemist',
    'The Bridges of Madison County',
    'Ben-Hur: A Tale of the Christ',
    'One Hundred Years of Solitude ',
    'You Can Heal Your Life',
    'Anne of Green Gables',
    'The Name of the Rose',
    'The Eagle Has Landed',
    'Watership Down',
    'The Hite Report',
    'The Tale of Peter Rabbit',
    'Jonathan Livingston Seagull',
    'The Very Hungry Caterpillar',
    'A Message to Garcia',
    'To Kill a Mockingbird',
    'Flowers in the Attic',
    'Angels & Demons'
]

var gBooks
var gFilterBy = { minRate: 0, maxPrice: 100, searchByTitle: '' }
var gSortBy = 'TITLE'
var gIsSortDescend = false
var gPageIndex = 0

function initBookService() {
    _createBooks()
    setBookSort()
}

function getBooksForDisplay() {
    var books = gBooks.filter(book => 
        (book.rate >= gFilterBy.minRate) 
        && (book.price < gFilterBy.maxPrice)
        && (book.title.toUpperCase().includes(gFilterBy.searchByTitle.toUpperCase())))

    const startIdx = gPageIndex * BOOKS_PER_PAGE
    books = books.slice(startIdx, startIdx + BOOKS_PER_PAGE)
    return books
}

function nextPage() {
    enablePageNav('prev-button')
    gPageIndex++
    if (gPageIndex * BOOKS_PER_PAGE >= gBooks.length - BOOKS_PER_PAGE) disablePageNav('next-button')
    if (gPageIndex * BOOKS_PER_PAGE >= gBooks.length) gPageIndex = 0
}

function prevPage() {
    enablePageNav('next-button')
    if (gPageIndex > 0) gPageIndex--
    if (gPageIndex === 0) disablePageNav('prev-button')
}

function setBookFilter(filterBy = {}) {
    if (filterBy.minRate !== undefined) gFilterBy.minRate = filterBy.minRate
    if (filterBy.maxPrice !== undefined) gFilterBy.maxPrice = filterBy.maxPrice
    if (filterBy.searchByTitle !== undefined) gFilterBy.searchByTitle = filterBy.searchByTitle
    
    return gFilterBy
}

function setBookSort(sortBy = 'TITLE', isSortDescend = false) {
    gSortBy = sortBy

    if (sortBy === 'TITLE') {
        gBooks.sort((bookA, bookB) => {
            const bookTitleA = bookA.title.toUpperCase()
            const bookTitleB = bookB.title.toUpperCase()

            return (bookTitleA < bookTitleB) ? -1
                : (bookTitleA > bookTitleB) ? 1
                    : 0
        })
    }
    if (sortBy === 'RATE') {
        gBooks.sort((bookA, bookB) => +bookA.rate - +bookB.rate)
    }
    if (gIsSortDescend !== isSortDescend) {
        gIsSortDescend = !isSortDescend
        gBooks.reverse()
    }

    return gBooks
}

function addBook(name, price) {
    const book = _createBook(name, price)
    gBooks.unshift(book)
    _saveBooksToStorage()
}

function updateBook(bookId, newPrice) {
    const book = getBookById(bookId)
    book.price = newPrice
    _saveBooksToStorage()
}

function removeBook(bookId) {
    gBooks.splice(getBookIdxById(bookId), 1)
    _saveBooksToStorage()
}

function increaseBookRate(bookId) {
    const book = getBookById(bookId)
    if (book.rate < 10) book.rate++
    _saveBooksToStorage()
}

function decreaseBookRate(bookId) {
    const book = getBookById(bookId)
    if (book.rate > 0) book.rate--
    _saveBooksToStorage()
}

function getBookIdxById(bookId) {
    const bookIdx = gBooks.findIndex(book => book.id === bookId)
    return bookIdx
}

function getBookById(bookId) {
    const book = gBooks.find(book => book.id === bookId)
    return book
}

function _createBooks() {

    var books = _loadBooksFromStorage()
    if (!books || !books.length) {
        books = []
        for (let i = 0; i < gBooksTitle.length; i++) {
            const bookTitle = gBooksTitle[i]
            books.push(_createBook(bookTitle))
        }
    }
    gBooks = books
    _saveBooksToStorage()
}

function _createBook(title, price) {
    const book = {
        id: makeId(),
        title: title,
        price: price || getRandomNum(1, 100),
        descreption: makeLorem(),
        rate: 0
    }
    return book
}

function _loadBooksFromStorage() {
    return loadFromStorage(STORAGE_KEY)
}

function _saveBooksToStorage() {
    saveToStorage(STORAGE_KEY, gBooks)
}