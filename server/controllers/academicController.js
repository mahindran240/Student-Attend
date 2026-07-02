import Department from "../models/Department.js";
import Subject from "../models/Subject.js";
import asyncHandler from "../middleware/asyncHandler.js";

const resources = {
  departments: Department,
  subjects: Subject
};

const getModel = (resource) => {
  const Model = resources[resource];
  if (!Model) {
    const error = new Error("Academic resource is not supported.");
    error.statusCode = 400;
    throw error;
  }
  return Model;
};

export const listResource = asyncHandler(async (req, res) => {
  const Model = getModel(req.params.resource);
  const items = await Model.find({}).sort({ name: 1 });
  res.json(items);
});

export const createResource = asyncHandler(async (req, res) => {
  const Model = getModel(req.params.resource);
  const item = await Model.create(req.body);
  res.status(201).json(item);
});

export const updateResource = asyncHandler(async (req, res) => {
  const Model = getModel(req.params.resource);
  const item = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) {
    res.status(404);
    throw new Error("Academic resource was not found.");
  }
  res.json(item);
});

export const deleteResource = asyncHandler(async (req, res) => {
  const Model = getModel(req.params.resource);
  const item = await Model.findByIdAndDelete(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error("Academic resource was not found.");
  }
  res.json({ message: "Academic resource deleted successfully." });
});
