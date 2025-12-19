// Sample book data
const books = [
    {
        title: "The Alchemist.jpg",
        author: "Alex Michaelides",
        price: "$12.99",
        img: "TheSilentPatient.JPEG"
    },
    {
        title: "Atomic Habits",
        author: "James Clear",
        price: "$10.50",
        img: "atomic habits.webp"
    },
    {
        title: "The Alchemist",
        author: "Paulo Coelho",
        price: "$8.99",
        img: "The Alchemist.jpg"
    },
    {
        title: "Think Like a Monk",
        author: "Jay Shetty",
        price: "$11.99",
        img: "Think Like a Monk.jpg"
    }
];

// Function to create a book card
function createBookCard(book) {
    return `
        <div class="col-md-3 col-sm-6">
            <div class="card shadow-sm h-100">
                <img src="${book.img}" class="card-img-top" alt="${book.title}">
                <div class="card-body">
                    <h5 class="card-title">${book.title}</h5>
                    <p class="card-text text-muted">by ${book.author}</p>
                    <p class="fw-bold">${book.price}</p>
                </div>
            </div>
        </div>
    `;
}

// Display books dynamically
function loadBooks() {
    const bookList = document.getElementById("bookList");

    // Loop through each book
    books.forEach(book => {
        bookList.innerHTML += createBookCard(book);
    });
}

// Call function when page loads
loadBooks();