const EnergyOutlooks = require('../model/model');

module.exports = async (req, res) => {
  try {
    const data = await EnergyOutlooks.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


