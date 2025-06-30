import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  status: { 
    type: String, 
    enum: ['active', 'completed', 'on-hold'],
    default: 'active' 
  },
  progress: { type: Number, default: 0 },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
}, {
  timestamps: true,
});

const Project = mongoose.model('Project', projectSchema);

export default Project; 