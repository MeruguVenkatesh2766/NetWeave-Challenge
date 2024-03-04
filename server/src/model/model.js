const mongoose = require("mongoose");

const energyOutlookSchema = new mongoose.Schema({
  intensity: Number,
  url: String,
  relevance: Number,
  pestle: String,
  sector: String,
  topic: String,
  insight: String,
  start_year: Date,
  impact: String,
  added: Date,
  end_year: Date,
  region: String,
  source: String,
  title: String,
  likelihood: Number,
  published: Date,
  country: String
});

module.exports = mongoose.model("EnergyOutlooks", energyOutlookSchema);
