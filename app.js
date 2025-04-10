const todoForm = document.querySelector("form");
const todoInput = document.getElementById("todo-input");
const todoListUL = document.getElementById("todo-list");

let allTodos = getTodos();
updateTodoList();

todoForm.addEventListener('submit', function(e){
    e.preventDefault();
    addTodo();
});

function addTodo(){
    const todoText = todoInput.value.trim();
    if(todoText.length > 0){
        const todoObject = {
            text: todoText,
            completed: false
        }
        allTodos.push(todoObject);
        updateTodoList()
        saveTodos();
        todoInput.value = "";
    } 
}
function updateTodoList(){
    todoListUL.innerHTML = "";
    allTodos.forEach((todo, todoIndex) => {
        todoItem = createTodoItem(todo, todoIndex);
        todoListUL.append(todoItem)
    })
}
function createTodoItem(todo, todoIndex) {
    const todoId = "todo-"+todoIndex;
    const todoLI = document.createElement("li");
    const todoText = todo.text;
    todoLI.className = "todo";
    todoLI.innerHTML = `<input type="checkbox" id="${todoId}">
                <label class="custom-checkbox" for="${todoId}">
                <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
                    <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
                </label>
                <label for="${todo}" class="todo-text">
                ${todoText}
                </label>
                <button class="edit-button">
                    <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
                        <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
                    </svg>
                </button>
                <button class="delete-button">
                    <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
                        <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                    </svg>
                </button>`;
    
    const deleteButton = todoLI.querySelector(".delete-button");
    deleteButton.addEventListener("click", ()=>{
        deleteTodoItem(todoIndex);
    });
    
    
    const editButton = todoLI.querySelector(".edit-button");
    editButton.addEventListener("click", ()=>{
        enableEditMode(todoLI, todoIndex);
    });
    
    const checkbox = todoLI.querySelector("input");
    checkbox.addEventListener("change", ()=>{
        allTodos[todoIndex].completed = checkbox.checked;
        saveTodos();
    });
    checkbox.checked = todo.completed;
    
    return todoLI;
}


function enableEditMode(todoLI, todoIndex) {
    const currentText = allTodos[todoIndex].text;
    const todoTextElement = todoLI.querySelector(".todo-text");
    
 
    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.value = currentText;
    editInput.className = "edit-input";
    
  
    todoTextElement.replaceWith(editInput);
    editInput.focus();
    
   
    editInput.addEventListener("keyup", function(e) {
        if (e.key === "Enter") {
            saveEdit(todoLI, todoIndex, editInput.value);
        }
    });
    
    editInput.addEventListener("blur", function() {
        saveEdit(todoLI, todoIndex, editInput.value);
    });
}


function saveEdit(todoLI, todoIndex, newText) {
    const trimmedText = newText.trim();
    
    if (trimmedText.length > 0) {
        allTodos[todoIndex].text = trimmedText;
        saveTodos();
    }
    

    const todoTextElement = document.createElement("label");
    todoTextElement.className = "todo-text";
    todoTextElement.textContent = allTodos[todoIndex].text;
    
    const editInput = todoLI.querySelector(".edit-input");
    editInput.replaceWith(todoTextElement);
}
function deleteTodoItem(todoIndex){
    allTodos = allTodos.filter((_,i)=> i !== todoIndex);
    saveTodos();
    updateTodoList();
}

function saveTodos(){
    const todosJason = JSON.stringify(allTodos);
    localStorage.setItem("todos", todosJason);
}
function getTodos(){
    const todos = localStorage.getItem("todos") || "[]";
    return JSON.parse(todos);
}