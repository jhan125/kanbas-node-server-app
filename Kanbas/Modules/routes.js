import * as dao from "./dao.js";
import { findCourseById } from "../Courses/dao.js";

export default function ModuleRoutes(app) {
  const createModule = async (req, res) => {
    const course = await findCourseById(req.params.cid);
    const newModule = {
      ...req.body,
      course: course.number,
    };
    const module = await dao.createModule(newModule);
    res.json(module);
  }
  const findModuleByCourse = async (req, res) => {
    const course = await findCourseById(req.params.cid);
    const modules = await dao.findModuleByCourse(course.number);
    res.json(modules);
  }
  const updateModule = async (req, res) => {
    const { mid } = req.params.mid
    const status = await dao.updateModule(mid, req.body);
    res.json(status);
  }
  const deleteModule = async (req, res) => {
    const status = await dao.deleteModule(req.params.mid);
    res.json(status);
  }

  app.post("/api/courses/:cid/modules", createModule);
  app.get("/api/courses/:cid/modules", findModuleByCourse);
  app.put("/api/modules/:mid", updateModule);
  app.delete("/api/modules/:mid", deleteModule);
}