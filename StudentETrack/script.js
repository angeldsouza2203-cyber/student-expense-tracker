// ========================================
// STUDENT EXPENSE TRACKER
// ========================================

// Load saved expenses from Local Storage
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];


// ========================================
// GET HTML ELEMENTS
// ========================================

const expenseForm = document.getElementById("expenseForm");
const expenseList = document.getElementById("expenseList");

const totalAmount = document.getElementById("totalAmount");
const totalExpenses = document.getElementById("totalExpenses");
const highestExpense = document.getElementById("highestExpense");

const searchInput = document.getElementById("searchInput");
const filterCategory = document.getElementById("filterCategory");
const categorySummary = document.getElementById("categorySummary");


// ========================================
// ADD EXPENSE
// ========================================

expenseForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const expenseName = document.getElementById("expenseName").value;
    const amount = document.getElementById("amount").value;
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;


    // Validate form
    if (
        expenseName === "" ||
        amount === "" ||
        category === "" ||
        date === ""
    ) {
        alert("Please fill in all the fields.");
        return;
    }


    // Create expense object
    const expense = {
        name: expenseName,
        amount: Number(amount),
        category: category,
        date: date
    };


    // Add expense to array
    expenses.push(expense);


    // Save to Local Storage
    saveExpenses();


    // Update page
    displayExpenses();
    updateDashboard();
    updateCategorySummary();


    // Clear form
    expenseForm.reset();
});


// ========================================
// DISPLAY EXPENSES
// ========================================

function displayExpenses() {

    // Clear existing list
    expenseList.innerHTML = "";


    // Get search text
    const searchText = searchInput.value.toLowerCase();


    // Get selected category
    const selectedCategory = filterCategory.value;


    // Filter expenses
    const filteredExpenses = expenses.filter(function(expense) {

        const matchesSearch = expense.name
            .toLowerCase()
            .includes(searchText);


        const matchesCategory =
            selectedCategory === "All" ||
            expense.category === selectedCategory;


        return matchesSearch && matchesCategory;
    });


    // Show message if nothing is found
    if (filteredExpenses.length === 0) {

        expenseList.innerHTML = `
            <p>No expenses found.</p>
        `;

        return;
    }


    // Display expenses
    filteredExpenses.forEach(function(expense) {

        const index = expenses.indexOf(expense);

        const expenseItem = document.createElement("div");


        expenseItem.className = "expense-card";

        expenseItem.innerHTML = `
            <div class="expense-info">
                <h3>${expense.name}</h3>
                <span class="category">${expense.category}</span>
            </div>

            <div class="expense-details">
                <p>${expense.date}</p>
                <strong>₹${expense.amount}</strong>
            </div>

            <div class="expense-actions">
               <button onclick="editExpense(${index})">
               Edit
               </button>

               <button onclick="deleteExpense(${index})">
               Delete
               </button>
               </div>
`;


        expenseList.appendChild(expenseItem);
    });
}


// ========================================
// DELETE EXPENSE
// ========================================

function deleteExpense(index) {

    expenses.splice(index, 1);

    saveExpenses();

    displayExpenses();
    updateDashboard();
    updateCategorySummary();
}


// ========================================
// EDIT EXPENSE
// ========================================

function editExpense(index) {

    const expense = expenses[index];


    const newName = prompt(
        "Enter expense name:",
        expense.name
    );


    const newAmount = prompt(
        "Enter amount:",
        expense.amount
    );


    const newCategory = prompt(
        "Enter category:",
        expense.category
    );


    const newDate = prompt(
        "Enter date:",
        expense.date
    );


    if (
        newName !== null &&
        newAmount !== null &&
        newCategory !== null &&
        newDate !== null
    ) {

        expense.name = newName;

        expense.amount = Number(newAmount);

        expense.category = newCategory;

        expense.date = newDate;


        saveExpenses();

       displayExpenses();
       updateDashboard();
       updateCategorySummary();
    }
}


// ========================================
// UPDATE DASHBOARD
// ========================================

function updateDashboard() {

    // Calculate total spending
    const total = expenses.reduce(function(sum, expense) {

        return sum + expense.amount;

    }, 0);


    // Find highest expense
    let highest = 0;


    expenses.forEach(function(expense) {

        if (expense.amount > highest) {

            highest = expense.amount;
        }
    });


    // Update dashboard
    totalAmount.textContent = `₹${total}`;

    totalExpenses.textContent = expenses.length;

    highestExpense.textContent = `₹${highest}`;
}


// ========================================
// SAVE EXPENSES
// ========================================

function saveExpenses() {

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );
}


// ========================================
// SEARCH
// ========================================

searchInput.addEventListener("input", function() {

    displayExpenses();
});


// ========================================
// CATEGORY FILTER
// ========================================

filterCategory.addEventListener("change", function() {

    displayExpenses();
});


// ========================================
// LOAD SAVED DATA WHEN PAGE OPENS
// ========================================

// ========================================
// CATEGORY SPENDING SUMMARY
// ========================================

function updateCategorySummary() {

    // Object to store category totals
    const categoryTotals = {};

    // Calculate total for each category
    expenses.forEach(function(expense) {

        if (categoryTotals[expense.category]) {

            categoryTotals[expense.category] += expense.amount;

        } else {

            categoryTotals[expense.category] = expense.amount;
        }

    });


    // Clear old summary
    categorySummary.innerHTML = "";


    // Display category totals
    for (let category in categoryTotals) {

        const summaryItem = document.createElement("div");

        summaryItem.className = "category-summary-item";

        summaryItem.innerHTML = `
            <span>${category}</span>
            <strong>₹${categoryTotals[category]}</strong>
        `;

        categorySummary.appendChild(summaryItem);
    }


    // Show message if there are no expenses
    if (Object.keys(categoryTotals).length === 0) {

        categorySummary.innerHTML = `
            <p>No spending data available.</p>
        `;
    }
}
displayExpenses();
updateDashboard();
updateCategorySummary();