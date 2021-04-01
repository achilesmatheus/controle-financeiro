const balance = document.querySelector("h3 .balance");
const expense = document.querySelector(".expense");
const income = document.querySelector(".income");
const transactionsList = document.querySelector(".transactions_list ul");
const inputName = document.querySelector("#name");
const inputValue = document.querySelector("#value");
const buttonAdd = document.querySelector("button");

let transactionsArray = JSON.parse(localStorage.getItem('transactions')) || []

const radioButtonIsChecked = radioButton => !!radioButton.checked

const getSelectedRadioButton = () => {
  const radioButtons = document.querySelectorAll('input[type="radio"]')
  let checkedRadio;

  radioButtons.forEach(radio => {
    if (radioButtonIsChecked(radio)) checkedRadio = radio
  })
  return checkedRadio
}

const createTransaction = () => ({
  name: inputName.value,
  value: +inputValue.value,
  type: getSelectedRadioButton().value
});


const deleteTransaction = ({ target }) => {
  if (target.classList.contains('delete')) {
    const spanName = target.nextElementSibling
    transactionsArray = transactionsArray
      .filter(transaction => transaction.name !== spanName.textContent)

    target.parentElement.remove()

    insertIntoLocalStorage(transactionsArray)
    updateValues(transactionsArray)
  }
}

const insertTransactionsIntoList = transactionsArray => {
  // clear ul before insert elements to prevent duplications
  transactionsList.innerHTML = ''

  transactionsArray.forEach(({ name, value }) => {
    const liElement = document.createElement("li");
    const spanText = document.createElement("span");
    const spanValue = document.createElement("span");
    const deleteButton = document.createElement("span");

    spanText.textContent = name;
    spanValue.textContent = value;
    deleteButton.textContent = "x";

    spanText.classList.add("transaction_name");
    spanValue.classList.add("transaction_value");
    deleteButton.classList.add("delete");

    liElement.append(deleteButton);
    liElement.append(spanText);
    liElement.append(spanValue);
    transactionsList.append(liElement);
  })
};

const formatedTransactionValue = transactionValue =>
  `R$ ${transactionValue.toFixed(2)}`;

const updateValues = transactions => {
  const incomeValue = transactions
    .filter(transaction => transaction.type === 'income')
    .reduce((acc, transaction) => { return acc + transaction.value }, 0)

  const expenseValue = transactions
    .filter(transaction => transaction.type === 'expense')
    .reduce((acc, transaction) => { return acc - transaction.value }, 0)

  const balanceValue = incomeValue + expenseValue

  income.textContent = formatedTransactionValue(incomeValue)
  expense.textContent = formatedTransactionValue(expenseValue)
  balance.textContent = formatedTransactionValue(balanceValue)

}

const insertIntoLocalStorage = transactions => {
  localStorage
    .setItem("transactions", JSON.stringify(transactions))
};

const init = () => {
  insertTransactionsIntoList(transactionsArray)
  updateValues(transactionsArray)
}

const clearInputs = (...inputs) => inputs.forEach(input => input.value = '')
const isInputsEmpty = (...inputs) => inputs.some(input => input.value === '')

handleClick = () => {
  if (isInputsEmpty(inputName, inputValue)) return alert('Preencha os campos')

  const newTransaction = createTransaction();
  transactionsArray.push(newTransaction)

  insertIntoLocalStorage(transactionsArray)
  insertTransactionsIntoList(transactionsArray)
  updateValues(transactionsArray)
  clearInputs(inputName, inputValue)
};

init()

transactionsList.addEventListener('click', deleteTransaction)
buttonAdd.addEventListener("click", handleClick);
