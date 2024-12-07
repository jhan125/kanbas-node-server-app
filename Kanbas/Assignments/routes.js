import * as dao from "./dao.js";

export default function AssignmentRoutes(app) {
  // Update an existing assignment globally by assignment ID
  const updateAssignment = async (req, res) => {
    const aid = req.params.aid; // Extract assignment ID from the route
    const assignmentUpdates = req.body; // Get the updates from the request body
    console.log("Updating assignment(%s)...", aid);
    const status = await dao.updateAssignment(aid, assignmentUpdates); // Update assignment in the DAO
    res.send(status);
  };

  // Delete an assignment globally by assignment ID
  const deleteAssignment = async (req, res) => {
    const aid = req.params.aid;
    console.log("Deleting assignment(%s)...", aid);
    const status = await dao.deleteAssignment(aid);
    res.send(status);
  };

  const getAssignmentByID = async (req, res) => {
    const aid = req.params.aid;
    console.log("Fetching assignment by ID: %s...", aid);
    const assignment = await dao.findAssignmentByID(aid);
    res.json(assignment);
  }

  app.get("/api/assignments/:aid", getAssignmentByID);
  app.put("/api/assignments/:aid", updateAssignment);
  app.delete("/api/assignments/:aid", deleteAssignment);
}
