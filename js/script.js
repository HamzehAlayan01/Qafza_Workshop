// ============================================================================
// مشروع ورشة JavaScript: وين راحت المصاريف؟
// النسخة المبسطة
// ============================================================================

// 1. البيانات والتخزين
const STORAGE_KEY = "masareef_transactions";

let transactions;
if (localStorage.getItem(STORAGE_KEY)) {
    transactions = JSON.parse(localStorage.getItem(STORAGE_KEY));
} else {
    transactions = initialTransactions
}



function saveTransactions() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(transactions)
    );
}

function formatAmount(amount) {
    return Number(amount).toFixed(2) + " د.أ";
}

// 2. اختيار عناصر HTML
const form =
    document.getElementById("transaction-form");

const transactionsList =
    document.getElementById("transactions-list");

const searchInput =
    document.getElementById("search-input");

const dateInput =
    document.getElementById("tx-date");

dateInput.value =
    new Date().toISOString().split("T")[0];

// 3. عرض البيانات
function render() {
    const search = searchInput.value.toLowerCase();

    const filteredTransactions = transactions.filter(
        function (transaction) {
            return transaction.title
                .toLowerCase()
                .includes(search);
        }
    );

    document.getElementById("empty-state").style.display =
        filteredTransactions.length === 0
            ? "block"
            : "none";

    document.getElementById("tx-count-badge").textContent =
        `${filteredTransactions.length} معاملة`;

    transactionsList.innerHTML = filteredTransactions
        .map(function (transaction) {
            return `
                <li class="transaction-item">

                    <div class="tx-main">

                        <div class="tx-icon ${transaction.type}">
                            <i class="fa-solid ${transaction.type === "income"
                    ? "fa-arrow-up"
                    : "fa-arrow-down"
                }"></i>
                        </div>

                        <div class="tx-details">

                            <span class="tx-title">
                                ${transaction.title}
                            </span>

                            <div class="tx-meta">

                                <span class="badge">
                                    ${transaction.category}
                                </span>

                                <span>
                                    ${transaction.date}
                                </span>

                            </div>

                        </div>

                    </div>

                    <div class="tx-end">

                        <div class="tx-amount ${transaction.type}">
                            ${transaction.type === "income"
                    ? "+"
                    : "-"
                }

                            ${formatAmount(transaction.amount)}
                        </div>

                        <button
                            class="action-icon-btn delete"
                            onclick="deleteTransaction(${transaction.id})"
                        >
                            <i class="fa-regular fa-trash-can"></i>
                        </button>

                    </div>

                </li>
            `;
        })
        .join("");

    calculateTotals();
}

// 4. حساب الدخل والمصاريف والرصيد
function calculateTotals() {
    let income = 0;
    let expense = 0;

    transactions.forEach(function (transaction) {
        if (transaction.type === "income") {
            income += Number(transaction.amount);
        } else {
            expense += Number(transaction.amount);
        }
    });

    document.getElementById("total-income").textContent =
        formatAmount(income);

    document.getElementById("total-expense").textContent =
        formatAmount(expense);

    document.getElementById("total-balance").textContent =
        formatAmount(income - expense);
}

// 5. إضافة معاملة جديدة
form.addEventListener("submit", function (event) {
    event.preventDefault();

    const newTransaction = {
        id: Date.now(),

        title:
            document.getElementById("tx-title").value,

        amount:
            document.getElementById("tx-amount").value,

        category:
            document.getElementById("tx-category").value,

        date:
            dateInput.value,

        type:
            document.getElementById("tx-type").value
    };

    transactions.unshift(newTransaction);

    saveTransactions();
    render();

    form.reset();

    dateInput.value =
        new Date().toISOString().split("T")[0];

    setType("expense");
});

// 6. حذف معاملة
function deleteTransaction(id) {
    transactions = transactions.filter(
        function (transaction) {
            return transaction.id !== id;
        }
    );

    saveTransactions();
    render();
}

// 7. اختيار مصروف أو دخل
function setType(type) {
    document.getElementById("tx-type").value = type;

    const expenseButton =
        document.getElementById("type-btn-expense");

    const incomeButton =
        document.getElementById("type-btn-income");

    expenseButton.classList.toggle(
        "active",
        type === "expense"
    );

    expenseButton.classList.toggle(
        "expense",
        type === "expense"
    );

    incomeButton.classList.toggle(
        "active",
        type === "income"
    );

    incomeButton.classList.toggle(
        "income",
        type === "income"
    );
}

document.getElementById("type-btn-expense").onclick =
    function () {
        setType("expense");
    };

document.getElementById("type-btn-income").onclick =
    function () {
        setType("income");
    };

// 8. البحث
searchInput.addEventListener("input", render);

// 9. التشغيل الأولي
setType("expense");
render();