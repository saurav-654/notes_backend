// models/Note.js
const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
   noteId: {
    type: String,
    required: true,
    unique: true,      // each noteId must be unique
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate for tenant
noteSchema.virtual('tenant', {
  ref: 'Tenant',
  localField: 'tenantId',
  foreignField: '_id',
  justOne: true
});

// Virtual populate for owner
noteSchema.virtual('owner', {
  ref: 'User',
  localField: 'ownerId',
  foreignField: '_id',
  justOne: true
});

// Indexes
noteSchema.index({ tenantId: 1 });
noteSchema.index({ ownerId: 1 });
noteSchema.index({ createdAt: -1 });
noteSchema.index({ updatedAt: -1 });

// Compound indexes for efficient queries
noteSchema.index({ tenantId: 1, createdAt: -1 });
noteSchema.index({ tenantId: 1, ownerId: 1 });
noteSchema.index({ tenantId: 1, noteId:1});
noteSchema.index({ tenantId: 1, title: 'text', content: 'text' });

// Pre-save middleware to update updatedAt
noteSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.updatedAt = new Date();
  }
  next();
});

// Static method to find notes by tenant
noteSchema.statics.findByTenant = function(tenantId, options = {}) {
  const { page = 1, limit = 10, ownerId } = options;
  const skip = (page - 1) * limit;
  
  let query = this.find({ tenantId });
  
  if (ownerId) {
    query = query.where('ownerId').equals(ownerId);
  }
  
  return query
    .populate('owner', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

module.exports = mongoose.model('Note', noteSchema);
