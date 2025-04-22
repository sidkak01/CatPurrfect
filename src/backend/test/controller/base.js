"use strict";

class BaseCtrl {
  getAll = async (req, res) => {
    try {
      const docs = await this.model.find({});
      res.status(200).json(docs);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  count = async (req, res) => {
    try {
      const count = await this.model.countDocuments();
      res.status(200).json(count);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  insert = async (req, res) => {
    try {
      const obj = await new this.model(req.body).save();
      res.status(201).json(obj);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  get = async (req, res) => {
    try {
      const obj = await this.model.findOne({ _id: req.params.id });
      res.status(200).json(obj);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  update = async (req, res) => {
    try {
      await this.model.findOneAndUpdate({ _id: req.params.id }, req.body);
      res.sendStatus(200);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  delete = async (req, res) => {
    try {
      await this.model.findOneAndDelete({ _id: req.params.id });
      res.sendStatus(200);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  deleteAll = async (_req, res) => {
    try {
      await this.model.deleteMany();
      res.sendStatus(200);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
}

export default BaseCtrl;
