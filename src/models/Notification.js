const moment = require("moment");
const mongoose = require("mongoose");
const AttachmentSchema = require("./schemas/AttachmentSchema");

const NotificationSchema = new mongoose.Schema({
  suburbId: {
    type: String,
  },
  title: {
    type: String,
  },
  body: {
    type: String,
  },
  level: {
    type: String,
    enum: ["info", "warning", "danger", "success"],
  },
  attachments: [AttachmentSchema],
  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  transtime: {
    type: Date,
    default: moment.utc(),
  },
});

NotificationSchema.statics = {
  Save(notificationObject) {
    const notification = new this(notificationObject);
    return notification.save();
  },
  Delete(notificationId) {
    return this.deleteOne({ _id: notificationId });
  },
  GetById(notificationId) {
    return this.findOne({ _id: notificationId }).lean();
  },
  GetBySuburbId(
    suburbId,
    minDate = moment.utc().add(-90, "days").format("YYYY-MM-DD")
  ) {
    return this.find({
      suburbId,
      transtime: { $gte: moment(minDate) },
      users: { $exists: true, $size: 0 },
    }).lean();
  },
  GetByUserId(
    suburbId,
    userId,
    minDate = moment.utc().add(-90, "days").format("YYYY-MM-DD")
  ) {
    return this.find({
      suburbId,
      transtime: { $gte: minDate },
      users: { $elemMatch: { $in: [userId] } },
    }).lean();
  },
};

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = Notification;
