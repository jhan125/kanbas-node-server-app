let todos = [
  { id: 1, 
    title: "Task 1", 
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-09-09", 
    completed: false },

  { id: 2, 
    title: "Task 2", 
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-09-09",
    completed: true },

  { id: 3, 
    title: "Task 3", 
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-09-09", 
    completed: false },

  { id: 4, title: "Task 4", 
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-09-09",
    completed: true },];

export default function WorkingWithArrays(app) {

  // createTodo: GET
  // Server creates a new todo internally, without client input.
  // Responds with the entire todos array.
  // Simple server-side creation of a default todo.
  app.get("/lab5/todos/create", (req, res) => {
    const newTodo = { 
      id: new Date().getTime(), 
      title: "New Task", 
      completed: false };
    todos.push(newTodo);
    res.json(todos);
  });

  // postTodo: POST
  // Client provides the todo object in the request body.
  // Responds with the newly created todo object.
  // Flexible client-side creation with custom data.
  // Scalable and efficient approach to resource creation, following RESTful conventions.
  app.post("/lab5/todos", (req, res) => {
    const newTodo = { 
      ...req.body, 
      id: new Date().getTime() };
    todos.push(newTodo);
    res.json(newTodo);
  });


  app.get("/lab5/todos", (req, res) => {
    const { completed } = req.query;

    if (completed !== undefined) {
      const completedBool = completed === "true";

      const completedTodos = todos.filter(
        (t) => t.completed === completedBool);

      res.json(completedTodos); 
      return;
    }

    res.json(todos);
  });

  app.get("/lab5/todos/:id", (req, res) => {
    const { id } = req.params;
    const todo = todos.find((t) => t.id === parseInt(id));
    res.json(todo);
  });

  // removeTodo: 	GET (non-RESTful)
  // Deletes a todo and returns the entire todos array.
  // Responds with the updated todos array.
  app.get("/lab5/todos/:id/delete", (req, res) => {
    const { id } = req.params;
    const todoIndex = todos.findIndex((t) => t.id === parseInt(id));

    if (todoIndex === -1) {
      res.status(404).json({ message: `Unable to delete Todo with ID ${id}` });
      return;
    }
    
    todos.splice(todoIndex, 1);
    res.json(todos);
  });

  // deletTodo: DELETE (RESTful, efficient)
  // Deletes a todo without returning any data
  // Responds only with a success or error status.
  app.delete("/lab5/todos/:id", (req, res) => {
    const { id } = req.params;
    const todoIndex = todos.findIndex((t) => t.id === parseInt(id));

    if (todoIndex === -1) {
      res.status(404).json({ message: `Unable to delete Todo with ID ${id}` });
      return;
    }

    todos.splice(todoIndex, 1);
    res.sendStatus(200);
  });


  app.get("/lab5/todos/:id/title/:title", (req, res) => {
    const { id, title } = req.params;
    const todo = todos.find((t) => t.id === parseInt(id));
    todo.title = title;
    res.json(todos);
  });

  app.get("/lab5/todos/:id/completed/:completed", (req, res) => {
    const { id, completed } = req.params;
    const todo = todos.find((t) => t.id === parseInt(id));
    // Convert the string "true"/"false" to a boolean
    todo.completed = completed === "true";
    res.json(todo);
  });

  app.get("/lab5/todos/:id/description/:description", (req, res) => {
    const { id, description } = req.params;
    const todo = todos.find((t) => t.id === parseInt(id));
    todo.description = description;
    res.json(todo);
  });
  

  app.put("/lab5/todos/:id", (req, res) => {
    const { id } = req.params;
    const todoIndex = todos.findIndex((t) => t.id === parseInt(id));

    if (todoIndex === -1) {
      res.status(404).json({ message: `Unable to update Todo with ID ${id}` });
      return;
    }

    todos = todos.map((t) => {
      if (t.id === parseInt(id)) {
        return { ...t, ...req.body };
      }
      return t;
    });

    res.sendStatus(200);
  });

};