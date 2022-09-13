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
  notificationType: {
    type: String,
    enum: ["survey", "push", "alert", "info"],
  },
  level: {
    type: String,
    enum: ["info", "warning", "danger", "success"],
  },
  attachments: [AttachmentSchema],
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
  Save: function (notificationObject) {
    const notification = new this(notificationObject);
    return notification.save();
  },
  Delete: function (notificationId) {
    return this.Delete({ _id: notificationId });
  },
  GetById: function (notificationId) {
    return this.findOne({ _id: notificationId }).lean();
  },
  GetBySuburbId: function (
    suburbId,
    minDate = moment.utc().add(-90, "days").format("YYYY-MM-DD")
  ) {
    this.find({ suburbId, transtime: { $gte: minDate } }).lean();
  },
  GetByUserId: function (
    suburbId,
    userId,
    minDate = moment.utc().add(-90, "days").format("YYYY-MM-DD")
  ) {
    return this.find({ suburbId, transtime: { $gte: minDate } })
      .select({ users: { $elemMatch: { _id: userId } } })
      .lean();
  },
};

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = Notification;
