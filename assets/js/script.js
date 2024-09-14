// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Function to generate a unique task id
function generateTaskId() {
  let id = nextId;
  nextId++;
  localStorage.setItem("nextId", JSON.stringify(nextId));
  return id;
}

// Function to generate a random pastel color
function generatePastelColor() {
  let hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 100%, 87%)`;
}

// Function to create a task card
function createTaskCard(task) {
  let card = $('<div>').addClass('card mb-3').attr('id', 'task-' + task.id);
  let cardBody = $('<div>').addClass('card-body');
  
  // Set the background color
  card.css('background-color', task.color || generatePastelColor());
  
  cardBody.append($('<h5>').addClass('card-title').text(task.title));
  cardBody.append($('<p>').addClass('card-text').text('Due: ' + task.date));
  cardBody.append($('<p>').addClass('card-text').text(task.description));
  
  let deleteBtn = $('<button>').addClass('btn btn-danger btn-sm float-end delete-task').text('Delete');
  deleteBtn.on('click', function() { handleDeleteTask(task.id); });
  
  cardBody.append(deleteBtn);
  card.append(cardBody);
  
  return card;
}

// Function to render the task list and make cards draggable
function renderTaskList() {
  $('#todo-cards, #in-progress-cards, #done-cards').empty(); // Clear existing cards
  
  taskList.forEach(function(task) {
    let card = createTaskCard(task);
    $(`#${task.status}-cards`).append(card);
  });

  // Make cards draggable
  $('.card').draggable({
    revert: 'invalid',
    cursor: 'move',
    zIndex: 100,
    containment: '.swim-lanes',
    helper: 'clone'
  });
}

// Function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();
  
  let newTask = {
    id: generateTaskId(),
    title: $('#task-title').val(),
    date: $('#task-date').val(),
    description: $('#task-description').val(),
    status: 'todo',
    color: generatePastelColor() // Add a random color to each new task
  };
  
  taskList.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(taskList));
  
  renderTaskList();
  $('#formModal').modal('hide');
  $('#task-form')[0].reset();
}

// Function to handle deleting a task
function handleDeleteTask(taskId) {
  taskList = taskList.filter(task => task.id !== taskId);
  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();
}

// Function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  let taskId = ui.draggable.attr('id').split('-')[1];
  let newStatus = $(this).attr('id').replace('-cards', '');
  
  let taskIndex = taskList.findIndex(task => task.id == taskId);
  if (taskIndex !== -1) {
    taskList[taskIndex].status = newStatus;
    localStorage.setItem("tasks", JSON.stringify(taskList));
  }
  
  renderTaskList();
}

// Wait for the DOM to be fully loaded before running the script
$(document).ready(function() {
  renderTaskList();
  
  $('#task-form').on('submit', handleAddTask);
  
  // Make columns droppable
  $('.droppable-area').droppable({
    accept: '.card',
    drop: handleDrop,
    hoverClass: 'drop-hover'
  });
});
