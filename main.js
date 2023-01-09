const API_BASE = 'https://nackademin-item-tracker.herokuapp.com/'
//const API_BASE = 'http://localhost:3000/'

const listSearchForm = document.querySelector('#list-search')
const listNameField = document.querySelector('#list-name')
const listsHolder = document.querySelector('#lists')
const listnameOutput = document.querySelector('#listname')
const listItemHolder = document.querySelector('#item-list')

let currentList

function drawItems(items) {
  listItemHolder.innerHTML = ''

  items.forEach(item => { 
    const liElem = document.createElement('li')
    liElem.innerHTML = `<h4>${item.title}</h4><p>${item.description}</p>`
    const deleteItemBtn = document.createElement('button')
    deleteItemBtn.innerText = 'Del'
    liElem.appendChild(deleteItemBtn)
    listItemHolder.appendChild(liElem)

    deleteItemBtn.addEventListener('click', function () { 
      console.log(item)
    })
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
      currentList = list.id
      listnameOutput.innerText = list.listname
      drawItems(list.itemList)
    })
  })
}

listSearchForm.addEventListener('submit', async function (e) { 
  e.preventDefault()

  const query = listNameField.value
  const res = await fetch(`${API_BASE}listsearch?listname=${query}`)
  const data = await res.json()

  drawLists(data)
})
