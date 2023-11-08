const Email = require("../models/Email");
const moment = require("moment");

exports.getDashboardData = async (req, res, next) => {
  try {
    const dashboardData1 = await Email.aggregate([
      // {
      //   // Stage 1: Match emails within a specific date range (if needed)
      //   $match: {
      //     // You can specify a date range here if needed
      //   },
      // },
      {
        // Stage 2: Extract the month and week of the year from the email's date field
        $project: {
          month: { $month: '$date' }, // Replace 'dateField' with the actual field name
          week: { $week: '$date' },   // Replace 'dateField' with the actual field name
        },
      },
      {
        // Stage 3: Group by month and week and count the emails
        $group: {
          _id: { month: '$month', week: '$week' },
          emailCount: { $sum: 1 },
        },
      },
      {
        // Stage 4: Group by month and create an array of weekly counts
        $group: {
          _id: '$_id.month',
          weeklyCounts: {
            $push: { week: '$_id.week', count: '$emailCount' },
          },
          monthlyCount: { $sum: '$emailCount' },
        },
      },
      {
        // Stage 5: Sort the results by month or perform any additional processing
        $sort: { _id: 1 }, // Sort by month if needed
      },
    ])

    let dashboardData=[];

    dashboardData1.forEach((data) => {
      return dashboardData.push({
        month: moment().month(data._id - 1).format("MMMM"),
        week1: data.weeklyCounts[0]?.count,
        week2: data.weeklyCounts[1]?.count,
        week3: data.weeklyCounts[2]?.count,
        week4: data.weeklyCounts[3]?.count,
        monthlyCount: data.monthlyCount,
      });
    })

    return res.status(200).json({ dashboardData });
  } catch (err) {
    console.log(err);
    const error = new Error("Dashboard Data fetching failed.");
    error.status = 500;
    return next(error);
  }
};
