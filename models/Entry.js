const mongoose = require('mongoose');

const RecurringSchema = new mongoose.Schema({
  interval: { type: String, enum: ['daily','weekly','monthly','yearly'], default: null },
  until: { type: Date, default: null }
}, { _id: false });

const EntrySchema = new mongoose.Schema({
  kind: { type: String, enum: ['income','expense','charity','saving'], required: true },
  date: { type: Date, required: true },
  category: { type: String, default: 'General' },
  note: { type: String, default: '' },
  amount: { type: Number, required: true },
  recurring: { type: RecurringSchema, default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Entry || mongoose.model('Entry', EntrySchema);
