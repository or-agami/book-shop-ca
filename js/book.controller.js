'use strict'


function onInit() {
    initBookService()
    renderQueryStringParams()
    renderBooks()
}

function renderBooks() {
    const books = getBooksForDisplay()
    const table = document.querySelector('.table')
    const strHTMLsTableHeader =
        `<thead class="table-header">
            <th class="id-header">ID</th>
            <th onclick="onSetSortBy('TITLE')" class="title-header">Title</th>
            <th onclick="onSetSortBy('RATE')" class="rate-header">Rate</th>
            <th class="price-header">Price</th>
            <th class="actions-header">Actions</th>
        </thead>`

    const strHTMLsTableData = books.map(book =>
        `<tr>
            <td class="text-align-center">${book.id}</td>
            <td>${book.title}</td>
            <td class="text-align-center">${book.rate}</td>
            <td class="text-align-center">${book.price}$</td>
            <td class="text-align-center">
                <button class="read-button" onclick="onReadBook('${book.id}')">Read</button>
                <button class="update-button" onclick="onUpdateBook('${book.id}')">Update</button>
                <button class="delete-button" onclick="onDeleteBook('${book.id}')">Delete</button>
            </td>
        </tr>`
    )
    table.innerHTML = strHTMLsTableHeader + strHTMLsTableData.join('')
}

function renderBookModal(bookId) {
    const book = getBookById(bookId)
    const elModal = document.querySelector('.modal')

    const strHTMLs =
        `<h3>Title: <br> ${book.title}</h3>
        <h4>Price: ${book.price}$</h4>
        <h5>Book Description</h5>
        <p>${book.descreption}</p>

        <div class="rate">
            <button onclick="onDecreaseBookRate('${book.id}')">-</button>
            <span>${book.rate}</span>
            <button onclick="onIncreaseBookRate('${book.id}')">+</button>
        </div>
        <button class="close-button" onclick="onCloseModal()">Close</button>`;

    elModal.innerHTML = strHTMLs
}

function renderQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const filterBy = {
        minRate: +queryStringParams.get('minRate') || 0,
        maxPrice: +queryStringParams.get('maxPrice') || 100,
        searchByTitle: queryStringParams.get('searchByTitle') || ''
    }
    const readBookModal = {
        bookId: queryStringParams.get('bookId') || '',
    }

    if (!filterBy.minRate && !filterBy.maxPrice && !filterBy.searchByTitle) return

    document.querySelector('.filter-rate-range').value = +filterBy.minRate
    document.querySelector('.filter-price-range').value = +filterBy.maxPrice
    document.querySelector('.search-input').value = filterBy.searchByTitle

    setBookFilter(filterBy)

    
    if (!(readBookModal.bookId)) return

    onReadBook(readBookModal.bookId)
}

function onAddBook() {
    const bookName = prompt('Enter Name:')
    const bookPrice = +prompt('Enter Price:')
    addBook(bookName, bookPrice)
    
    renderBooks()
}

function onUpdateBook(bookId) {
    const bookPrice = +prompt('Enter Price:')
    updateBook(bookId, bookPrice)
    
    renderBooks()
}

function onDeleteBook(bookId) {
    removeBook(bookId)
    const elShowDltMsg = document.querySelector('.delete-notification')
    elShowDltMsg.innerText = `Book ID '${bookId}' Deleted`
    elShowDltMsg.style.opacity = '100'
    setTimeout(() => { elShowDltMsg.style.opacity = '0' }, 1000)
    
    renderBooks()
}

function onIncreaseBookRate(bookId) {
    increaseBookRate(bookId)
    
    renderBookModal(bookId)
}

function onDecreaseBookRate(bookId) {
    decreaseBookRate(bookId)
    
    renderBookModal(bookId)
}

function onReadBook(bookId) {
    const elModal = document.querySelector('.modal')
    elModal.classList.add('open')
    
    setQueryStringParams('bookId', bookId)
    
    renderBookModal(bookId)
}

function onCloseModal() {
    const elModal = document.querySelector('.modal')
    elModal.classList.remove('open')
    
    deleteQueryStringParams('bookId')
    
    renderBooks()
}

function onSetFilterBy(filterBy) {
    setQueryStringParams(`${Object.keys(filterBy)[0]}`, `${Object.values(filterBy)[0]}`)

    filterBy = setBookFilter(filterBy)

    renderBooks()
    
    if (filterBy.minRate === 0) deleteQueryStringParams('minRate')
    if (filterBy.maxPrice === 100) deleteQueryStringParams('maxPrice')
    if (filterBy.searchByTitle === '') deleteQueryStringParams('searchByTitle')
}

function onSetSortBy(sortBy, isSortDescend = false) {
    const elSortDescBtn = document.querySelector('.sort-desc')
    const elSelectSortBy = document.querySelector('.sort-by')
    elSelectSortBy.value = sortBy
    elSortDescBtn.setAttribute('onclick', `onSetSortBy('${sortBy}', this.checked)`)
    
    setBookSort(sortBy, isSortDescend)
    renderBooks()
}

function onNextPage() {
    nextPage()
    
    renderBooks()
}

function onPrevPage() {
    prevPage()
    
    renderBooks()
}

function setQueryStringParams(objKey, objVal) {
    const queryStringParams = new URLSearchParams(window.location.search)
    queryStringParams.set(objKey, objVal)

    window.history.pushState({}, '', '?' + queryStringParams)
}

function deleteQueryStringParams(objKey, objVal) {
    const queryStringParams = new URLSearchParams(window.location.search)
    queryStringParams.delete(objKey, objVal)

    window.history.pushState({}, '', '?' + queryStringParams)
}

function disablePageNav(pageNavBtn) {
    const elPageNavBtn = document.querySelector(`.${pageNavBtn}`)
    elPageNavBtn.setAttribute('disabled', '')
}

function enablePageNav(pageNavBtn) {
    const elPageNavBtn = document.querySelector(`.${pageNavBtn}`)
    elPageNavBtn.removeAttribute('disabled')
}
