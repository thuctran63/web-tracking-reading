import { Model, Schema, model, models } from "mongoose";

export type DailyReportDocument = {
  _id: string;
  userId: string;
  date: Date;
  didRead: boolean;
  booksRead: string;
  learnings: string;
  difficulties: string;
  questions: string;
  createdAt: Date;
  updatedAt: Date;
};

const dailyReportSchema = new Schema<DailyReportDocument>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    didRead: {
      type: Boolean,
      required: true,
    },
    booksRead: {
      type: String,
      default: "",
      trim: true,
    },
    learnings: {
      type: String,
      default: "",
      trim: true,
    },
    difficulties: {
      type: String,
      default: "",
      trim: true,
    },
    questions: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

dailyReportSchema.index({ userId: 1, date: 1 }, { unique: true });

export const DailyReport: Model<DailyReportDocument> =
  (models.DailyReport as Model<DailyReportDocument>) ||
  model<DailyReportDocument>("DailyReport", dailyReportSchema);
