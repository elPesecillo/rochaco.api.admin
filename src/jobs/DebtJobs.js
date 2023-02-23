/* eslint-disable no-console */
const CronJob = require("node-cron");
const { JOB_STATUS_FAILED } = require("../constants/DebtTypes");
const DebtService = require("../logic/DebtService");
const SuburbService = require("../logic/suburbService");
const { SendEmailToAppAdmins } = require("../logic/EmailService");

exports.InitDebtJobs = () => {
  // This function is called every day at 4:00 AM
  const GenerateDebtsJob = CronJob.schedule("0 4 * * *", async () => {
    // const GenerateDebtsJob = CronJob.schedule("*/1 * * * *", async () => {
    // For testing
    try {
      console.log(`Generating automatic debts at ${new Date()}`);
      const automaticDebtConfigs = await DebtService.GetAutomaticDebtConfigs();
      if (automaticDebtConfigs.length > 0) {
        const promises = [];
        automaticDebtConfigs.forEach((config) => {
          promises.push(
            DebtService.GenerateAutomaticDebts(config._id.toString())
          );
        });
        const results = await Promise.all(promises);
        results.forEach((result) => {
          if (result.status === JOB_STATUS_FAILED) {
            console.error(result.message);
            return;
          }
          console.log(result.message);
        });
        console.log(`Generate automatic debts completed at ${new Date()}`);
      } else {
        console.log(`No automatic debt configs found {new Date()}`);
      }
    } catch (err) {
      await SendEmailToAppAdmins(
        `Error generating automatic debts`,
        `An error occurs while generating automatic debts: ${err.message}, ${
          err.stack
        }, time: ${new Date()}`
      );
      console.log(err);
    }
  });
  GenerateDebtsJob.start();

  // This function is called every day at 8:00 AM
  const UpdateDebtsReadyToBeChargedJob = CronJob.schedule(
    "0 8 * * *",
    async () => {
      // const UpdateDebtsReadyToBeChargedJob = CronJob.schedule(
      //   "*/1 * * * *",
      //   async () => {
      // For testing
      try {
        console.log(`Updating debts ready to be charged at ${new Date()}`);
        const suburbs = await SuburbService.GetAllSuburbs();
        if (suburbs.length === 0) {
          console.log(`No suburbs found at ${new Date()}`);
          return;
        }
        const promises = [];
        suburbs.forEach((suburb) => {
          promises.push(
            DebtService.UpdateDebtsReadyToBeCharged(suburb._id.toString())
          );
        });
        const results = await Promise.all(promises);
        results.forEach((result) => {
          if (result.status === JOB_STATUS_FAILED) {
            console.error(result.message);
            return;
          }
          console.log(result.message);

          // TODO: Send push notifications to each user with a new debt charged
        });

        console.log(
          `Update debts ready to be charged completed at ${new Date()}`
        );
      } catch (err) {
        await SendEmailToAppAdmins(
          `Error updating debts ready to be charged`,
          `An error occurs while updating debts ready to be charged: ${
            err.message
          }, ${err.stack}, time: ${new Date()}`
        );
        console.log(err);
      }
    }
  );
  UpdateDebtsReadyToBeChargedJob.start();

  // This function is called every day at 9:00 AM
  const UpdateDebtsExpiredJob = CronJob.schedule("0 9 * * *", async () => {
    // const UpdateDebtsExpiredJob = CronJob.schedule("*/1 * * * *", async () => {
    // For testing
    try {
      console.log(`Updating debts expired at ${new Date()}`);
      const suburbs = await SuburbService.GetAllSuburbs();
      if (suburbs.length === 0) {
        console.log(`No suburbs found at ${new Date()}`);
        return;
      }
      const promises = [];
      suburbs.forEach((suburb) => {
        promises.push(DebtService.UpdateDebtsExpired(suburb._id.toString()));
      });
      const results = await Promise.all(promises);
      results.forEach((result) => {
        if (result.status === JOB_STATUS_FAILED) {
          console.error(result.message);
          return;
        }
        console.log(result.message);

        // TODO: Send push notifications to each user with a new debt expired
      });
      console.log(`Update debts expired completed at ${new Date()}`);
    } catch (err) {
      await SendEmailToAppAdmins(
        `Error updating debts expired`,
        `An error occurs while updating debts expired: ${err.message}, ${
          err.stack
        }, time: ${new Date()}`
      );
      console.log(err);
    }
  });
  UpdateDebtsExpiredJob.start();
};
