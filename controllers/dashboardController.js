const Email = require("../models/Email");
const moment = require("moment");

exports.getDashboardData = async (req, res) => {
  try {
    const dashboardData = await Email.aggregate([
      {
        $project: {
          date: "$date",
          monthName: { $monthName: "$date" },
          week: { $week: "$date" },
        },
      },
      {
        $group: {
          _id: {
            monthName: "$monthName",
          },
          weeklyCounts: { $push: { week: "$week", count: 1 } },
          totalCount: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.monthName": 1,
        },
      },
    ]);

    return res.status(200).json({ dashboardData });
  } catch (err) {
    console.log(err);
    const error = new Error("Dashboard Data fetching failed.");
    error.status = 500;
    return next(error);
  }
};
