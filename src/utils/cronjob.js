const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const ConnectionRequest = require("../models/connectionRequest.model.js");
const sendEmail = require("../utils/sendEmail.js");

// This job will run at 8 a.m. daily.
cron.schedule("0 8 * * *", async () => {
  // Send emails to all the users who got connection requests the previous day.
  try {
    const yesterday = subDays(new Date(), 1);

    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const pendingRequests = await ConnectionRequest.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd,
      },
    }).populate("fromUserId toUserId");

    const listOfEmails = [
      ...new Set(pendingRequests.map((req) => req.toUserId.email)),
    ];

    for (const email of listOfEmails) {
      try {
        const res = await sendEmail.run(
          `New connection request pending for ${email}`,
          `There are so many connection requests pending for you to review. Open our app and accept or reject the requests.`
        );
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
  }
});
