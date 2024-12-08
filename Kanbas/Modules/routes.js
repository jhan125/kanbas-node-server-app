import * as dao from "./dao.js";

export default function ModuleRoutes(app) {
  
  const updateModule = async (req, res) => {
    const moduleID = req.params.mid
    const moduleUpdates = req.body;
    console.log("Updating module(%s)...", moduleID)
    const status = await dao.updateModule(moduleID, moduleUpdates);
    res.send(status);
  }
  
  const deleteModule = async (req, res) => {
    const moduleID = req.params.mid;
    console.log("Deleting module(%s)...", moduleID)
    const status = await dao.deleteModule(moduleID);
    res.send(status);
  }

  app.put("/api/modules/:mid", updateModule);
  app.delete("/api/modules/:mid", deleteModule);
}