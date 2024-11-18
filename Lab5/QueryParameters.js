export default function QueryParameters(app) {

  app.get("/lab5/calculator", (req, res) => {

    // e.g., http://localhost:4000/lab5/calculator?operation=add&a=34&b=23
    const { a, b, operation } = req.query;

    let result = 0;

    switch (operation) {
      case "add":
        result = parseInt(a) + parseInt(b);
        break;

      case "subtract":
        result = parseInt(a) - parseInt(b);
        break;

      case "multiply":
        result = parseInt(a) * parseInt(b);
        break;

      case "divide":
        result = parseInt(a) / parseInt(b);
        break;
        
      default:
        result = "Invalid operation";
    }
    res.send(result.toString());
  });
}