const API_BASE = 'https://nackademin-item-tracker.herokuapp.com/'

const createListForm = document.querySelector('#create-list')
const createListNameField = document.querySelector('#create-list-name')
const listSearchForm = document.querySelector('#list-search')
const listNameField = document.querySelector('#list-name')
const listsHolder = document.querySelector('#lists')
const listnameOutput = document.querySelector('#listname')
const listItemHolder = document.querySelector('#item-list')
const addItemForm = document.querySelector('#add-item')
const itemTitleField = document.querySelector('#item-title')
const itemDescField = document.querySelector('#item-desc')
const updateListForm = document.querySelector('#update-list')

let currentList = ''

function createItem(item) { 
  const liElem = document.createElement('li')
  liElem.innerHTML = `<h4>${item.title}</h4><p>${item.description}${item.checked ? '✅' : ''}</p>`

  const deleteItemBtn = document.createElement('button')
  deleteItemBtn.innerText = 'Del'
  liElem.appendChild(deleteItemBtn)
  
  const setAsCheckedBtn = document.createElement('button')
  setAsCheckedBtn.innerText = 'Check'
  liElem.appendChild(setAsCheckedBtn)

  listItemHolder.appendChild(liElem)

  deleteItemBtn.addEventListener('click', async function () { 
    const res = await fetch(`${API_BASE}lists/${currentList}/items/${item._id}`, {
      method: 'DELETE'
    })
    const { list } = await res.json()

    drawItems(list.itemList)
  })

  setAsCheckedBtn.addEventListener('click', async function () {
    const res = await fetch(`${API_BASE}lists/${currentList}/items/${item._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        checked: true
      })
    })
    const { list } = await res.json()

    drawItems(list.itemList)
  })
}

function drawItems(items) {
  listItemHolder.innerHTML = ''

  items.forEach(item => { 
    createItem(item)
  })
}

function drawLists(lists) { 
  listsHolder.innerHTML = ''

  lists.forEach(list => { 
    const liElem = document.createElement('li')
    liElem.innerText = list.listname
    const chooseListBtn = document.createElement('button')
    chooseListBtn.innerText = 'Choose'
    liElem.appendChild(chooseListBtn)
    listsHolder.appendChild(liElem)

    chooseListBtn.addEventListener('click', function () { 
      currentList = list._id
      listnameOutput.value = list.listname
      drawItems(list.itemList)
      listsHolder.innerHTML = ''
    })
  })
}

updateListForm.addEventListener('submit', async function (e) {
  e.preventDefault()

  if (!currentList) { 
    return alert('Choose a list')
  }

  const listname = listnameOutput.value
  
  await fetch(`${API_BASE}lists/${currentList}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      listname: listname
    })
  })
})

createListForm.addEventListener('submit', async function (e) { 
  e.preventDefault()

  const listname = createListNameField.value
  const res = await fetch(`${API_BASE}lists`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      listname: listname
    })
  })

  const { list } = await res.json()
  currentList = list._id
  listnameOutput.innerText = list.listname
  drawItems(list.itemList)
})

listSearchForm.addEventListener('submit', async function (e) { 
  e.preventDefault()

  const query = listNameField.value
  const res = await fetch(`${API_BASE}listsearch?listname=${query}`)
  const data = await res.json()

  drawLists(data)
})

addItemForm.addEventListener('submit', async function (e) { 
  e.preventDefault()

  if (!currentList) { 
    return alert('Choose a list')
  }

  const title = itemTitleField.value
  const desc = itemDescField.value

  if (!title || !desc) { 
    return alert('Fill text boxes')
  }

  const res = await fetch(`${API_BASE}lists/${currentList}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: title,
      description: desc
    })
  })
  const { list } = await res.json()

  drawItems(list.itemList)
})
