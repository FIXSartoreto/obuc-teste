const buildingOptions = ['Prédio 1', 'Prédio 2', 'Prédio 3', 'Prédio 4', 'Prédio 5'];
const menuItems = ['Administradores', 'Áreas', 'Locais de Trabalho', 'Habilidades', 'Log', 'Responsáveis'];

const generateMenu = () => {
  const menuContainer = document.querySelector('.side-menu');

  menuItems.forEach((item) => {
    const button = document.createElement('button');
    button.innerText = item;
    button.className = 'button-menu';
    menuContainer.appendChild(button);
  });
}

const generateOptions = (container) => {
  buildingOptions.forEach((building) => {
    const optionItem = document.createElement('option');
    optionItem.innerText = building;
    optionItem.value = building;
    container.appendChild(optionItem);
  });
}

const deleteIconFunc = (index) => {
  const dataStorage = JSON.parse(sessionStorage.getItem('arrLocaisTrabalho'));
  const rowDeleted = document.getElementById(`row ${index}`);
  rowDeleted.parentElement.removeChild(rowDeleted);
  const elementFound = dataStorage.find((item) => item.id === index);
  const elementIndex = dataStorage.indexOf(elementFound);
  dataStorage.splice(elementIndex, 1);
  sessionStorage.setItem('arrLocaisTrabalho', JSON.stringify(dataStorage));
}

const saveChanges = (index) => {
  const workplace = document.getElementById(`local ${index}`);
  const inputValue = document.getElementById(`input-${index}`).value;
  workplace.innerHTML = inputValue;

  const building = document.getElementById(`predio ${index}`);
  const selectedValue = document.getElementById(`item-building-list-${index}`).value;
  building.innerHTML = selectedValue;

  const dataStorage = JSON.parse(sessionStorage.getItem('arrLocaisTrabalho'));
  const elementFound = dataStorage.find((item) => item.id === index);
  const elementIndex = dataStorage.indexOf(elementFound);
  dataStorage[elementIndex].predio = selectedValue;
  dataStorage[elementIndex].local = inputValue;

  sessionStorage.setItem('arrLocaisTrabalho', JSON.stringify(dataStorage));
  generateList();
}

const createSaveIcon = (index, type) => {
  const div = document.getElementById(`div-${index}`);
  const iconSave = document.createElement('i');
  iconSave.className = `fas ${type} edit-${index}`;
  iconSave.addEventListener('click', () => saveChanges(index))
  div.insertBefore(iconSave, div.firstChild);

}

const editIconFunc = (index) => {
  const icon = document.querySelector(`.edit-${index}`);
  const workplace = document.getElementById(`local ${index}`);
  workplace.innerHTML = `<input type="text" id=input-${index} value=${workplace.innerText}>`

  const building = document.getElementById(`predio ${index}`);
  const buildingText = building.innerHTML;
  building.innerHTML = `<select name="item-building-list" id="item-building-list-${index}" class="item-building-list">`
  
  const itemBuildingList = document.getElementById(`item-building-list-${index}`);
  generateOptions(itemBuildingList);
  itemBuildingList.value = buildingText;

  icon.parentElement.removeChild(icon);
  createSaveIcon(index, 'fa-check-square');
}

const createDivIcons = (index) => {
  const div = document.createElement('div');
  div.id = `div-${index}`;
  const iconEdit = document.createElement('i');
  const iconDelete = document.createElement('i');
  iconDelete.className = 'fas fa-trash-alt';
  iconDelete.addEventListener('click', () => deleteIconFunc(index));

  iconEdit.className = `fas fa-edit edit-${index}`;
  iconEdit.addEventListener('click', () => editIconFunc(index));

  div.appendChild(iconEdit);
  div.appendChild(iconDelete);
  
  return div;
}

const generateList = () => {
  const tableBody = document.querySelector('.table-body');
  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.firstChild);
  }
  const dataStorage = JSON.parse(sessionStorage.getItem('arrLocaisTrabalho'));
  if (dataStorage) {
    dataStorage.forEach((item, index) => {
      const tr = document.createElement('tr');
      tr.className = 'list';
      tr.id = `row ${index}`;
      const td1 = document.createElement('td');
      const td2 = document.createElement('td');
      td1.id = `predio ${index}`
      td2.id = `local ${index}`
      td1.innerText = item.predio;
      td2.innerText = item.local;
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(createDivIcons(index));
      tableBody.appendChild(tr);
    });
  }
}

const buttonFunction = () => {
  let dataStorage = JSON.parse(sessionStorage.getItem('arrLocaisTrabalho'));
  if (!dataStorage) dataStorage = [];
  const buildingContainer = document.querySelector('.building-list');
  const inputLocation = document.querySelector('.input-location');
  const newItem = {
    id: dataStorage.length,
    predio: buildingContainer.value,
    local: inputLocation.value,
  }
  dataStorage.push(newItem);
  sessionStorage.setItem('arrLocaisTrabalho', JSON.stringify(dataStorage));
  buildingContainer.selectedIndex = 0;
  inputLocation.value = '';
  generateList();
}

const generateButton = () => {
  const buttonLocation = document.querySelector('.button-location');
  const sendButton = document.createElement('button');
  sendButton.className = 'button';
  sendButton.innerText = '+';
  sendButton.addEventListener('click', buttonFunction);
  buttonLocation.appendChild(sendButton);
}

window.onload = function onload() {
  generateMenu();
  generateOptions(document.querySelector('.building-list'));
  generateButton();
  generateList();  
}
