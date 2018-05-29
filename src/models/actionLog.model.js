import mongoose from 'mongoose';


/**
 * ActionLog Schema
 */
const ActionLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    index: true
  },
  type: {
    type: String, // regist
    index: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    index: true
  },
  note: String

}, {
  timestamps: true,
  collection: 'actionLogs'
});

/**
 * - pre-post-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
ActionLogSchema.method({});

/**
 * Statics
 */
ActionLogSchema.statics = {

};

/**
 * @typedef ActionLog
 */
export default mongoose.model('ActionLog', ActionLogSchema);
