const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  companyName: { type: String, required: true },
  industry: { type: String, required: true },
  logo: { type: String },
  symbol: { type: String },
  environmentalScore: { type: Number },
  socialScore: { type: Number },
  governanceScore: { type: Number },
  ESGScore: { type: Number },
  ESGRiskRating: { type: String },
  industryRank: { type: String },
  description: { type: String }
});

module.exports = mongoose.model('Company', CompanySchema);
