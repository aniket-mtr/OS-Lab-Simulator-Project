let memorySize, pageSize, numProcesses;
let pageTable = [];

function initializePageTable(event) {
  event.preventDefault();
  const urlParams = new URLSearchParams(window.location.search);
  memorySize = parseInt(document.getElementById('memorySize').value);
  pageSize = parseInt(document.getElementById('pageSize').value);
  numProcesses = parseInt(document.getElementById('numProcesses').value);
  let numPages = Math.floor(memorySize / pageSize);
  let remainingPages = numPages;
  const pageTableBody = document.getElementById('page-table').getElementsByTagName('tbody')[0];
  pageTableBody.innerHTML = '';
  pageTable = []; // Clear the existing page table before reinitializing

  for (let i = 1; i <= numProcesses; i++) {
    let processRow = document.createElement('tr');
    let processCell = document.createElement('td');
    let pagesCell = document.createElement('td');
    let frameCell = document.createElement('td');
    processCell.textContent = i;
    pagesCell.innerHTML = '';
    frameCell.innerHTML = '';
    let numPagesForProcess = 0;

    while (numPagesForProcess === 0 || numPagesForProcess > remainingPages) {
      numPagesForProcess = parseInt(prompt(`Enter the number of pages required for process ${i}:`));
      if (numPagesForProcess > remainingPages) {
        let errorMessage = document.createElement('p');
        errorMessage.textContent = 'Memory is full';
        errorMessage.classList.add('error-message');
        pageTableBody.appendChild(errorMessage);
      }
    }

    let processPageFrames = [];
    for (let j = 0; j < numPagesForProcess; j++) {
      let pageCell = document.createElement('span');
      pageCell.textContent = j + ' ';
      pagesCell.appendChild(pageCell);
      let frameInput = document.createElement('input');
      frameInput.type = 'number';
      frameInput.min = '0';
      frameInput.value = '0';
      frameInput.id = `process-${i}-page-${j}`;
      frameCell.appendChild(frameInput);
      processPageFrames.push(parseInt(frameInput.value));
    }

    remainingPages -= numPagesForProcess;

    processRow.appendChild(processCell);
    processRow.appendChild(pagesCell);
    processRow.appendChild(frameCell);
    pageTableBody.appendChild(processRow);
    pageTable.push({ processNumber: i, pages: numPagesForProcess, pageTable: processPageFrames });
  }
}

function translateAddress(event) {
  event.preventDefault();

  const processNumber = parseInt(document.getElementById('processNumber').value) - 1;
  const pageNumber = parseInt(document.getElementById('pageNumber').value);
  const offset = parseInt(document.getElementById('offset').value);

  if (
    processNumber < 0 ||
    processNumber >= pageTable.length ||
    pageNumber >= pageTable[processNumber].pages ||
    offset >= pageSize
  ) {
    let errorMessage = document.createElement('p');
    errorMessage.textContent = 'Invalid Process or Page Number or Offset';
    errorMessage.classList.add('error-message');
    document.getElementById('output').innerHTML = '';
    document.getElementById('output').appendChild(errorMessage);
    return;
  }

  const frameInput = document.getElementById(`process-${processNumber + 1}-page-${pageNumber}`);
  const frameNumber = parseInt(frameInput.value);
  const physicalAddress = frameNumber * pageSize + offset;

  let outputMessage = document.createElement('p');
  outputMessage.textContent = `The Physical Address is: ${physicalAddress}`;
  document.getElementById('output').innerHTML = '';
  document.getElementById('output').appendChild(outputMessage);
}
