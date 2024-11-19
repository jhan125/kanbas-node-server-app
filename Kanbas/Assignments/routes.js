// import * as assignmentsDao from "./dao.js";

// export default function AssignmentRoutes(app) {

//   app.post("/api/assignments", (req, res) => {
//     const assignment = req.body;
//     const newAssignment = assignmentsDao.createAssignment(assignment);
//     res.status(201).json(newAssignment);
//   });


//   app.delete("/api/assignments/:assignmentId", (req, res) => {
//     const { assignmentId } = req.params;
//     assignmentsDao.deleteAssignment(assignmentId);
//     res.sendStatus(204);
//   });

//   app.put("/api/assignments/:assignmentId", (req, res) => {
//     const { assignmentId } = req.params;
//     const assignmentUpdates = req.body;
//     assignmentsDao.updateAssignment(assignmentId, assignmentUpdates);
//     res.sendStatus(204);
//   });

// }

import * as assignmentsDao from "./dao.js";

export default function AssignmentRoutes(app) {
  // Create a new assignment for a specific course
  app.post("/api/courses/:cid/assignments", (req, res) => {
    const { cid } = req.params; // Extract course ID from the route
    const newAssignment = {
      ...req.body,
      course: cid, // Associate the assignment with the course
      _id: new Date().getTime().toString(), // Generate a unique ID for the assignment
    };
    assignmentsDao.createAssignment(newAssignment);
    res.status(201).json(newAssignment);
  });

  // Retrieve all assignments for a specific course
  app.get("/api/courses/:cid/assignments", (req, res) => {
    const { cid } = req.params; // Extract course ID from the route
    const assignments = assignmentsDao.findAssignmentsForCourse(cid); // Get course-specific assignments
    res.json(assignments);
  });

  // Update an existing assignment globally by assignment ID
  app.put("/api/assignments/:aid", (req, res) => {
    const { aid } = req.params; // Extract assignment ID from the route
    const assignmentUpdates = req.body; // Get the updates from the request body
    assignmentsDao.updateAssignment(aid, assignmentUpdates); // Update assignment in the DAO
    res.sendStatus(204); // Send a success status
  });

  // Delete an assignment globally by assignment ID
  app.delete("/api/assignments/:aid", (req, res) => {
    const { aid } = req.params; // Extract assignment ID from the route
    assignmentsDao.deleteAssignment(aid); // Delete the assignment from the DAO
    res.sendStatus(204); // Send a success status
  });
}
