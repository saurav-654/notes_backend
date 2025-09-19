// models/Tenant.js
const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[a-z0-9-]+$/
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  plan: {
    type: String,
    enum: ['FREE', 'PRO'],
    default: 'FREE'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate for users
tenantSchema.virtual('users', {
  ref: 'User',
  localField: '_id',
  foreignField: 'tenantId'
});

// Virtual populate for notes
tenantSchema.virtual('notes', {
  ref: 'Note',
  localField: '_id',
  foreignField: 'tenantId'
});

// Indexes
tenantSchema.index({ slug: 1 }, { unique: true });
tenantSchema.index({ createdAt: -1 });

// Pre-save middleware
tenantSchema.pre('save', function(next) {
  if (this.isModified('slug')) {
    this.slug = this.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  }
  next();
});

module.exports = mongoose.model('Tenant', tenantSchema);
