import TimeMachine from "../models/TimeMachine.js";
import triggerTimeMachineNotifications from "../utils/timeMachineNotifications.js";
import removeTemporaryTasks from "../utils/removeTemporaryTasks.js";

export const updateTimeMachine = async (req, res) => {
  const { userID, time } = req.body;

  try {
    const timeMachine = await TimeMachine.findOne({ userID });

    if (!timeMachine) {
      return res.status(404).json({ message: "Time machine not found for this user" });
    }

    timeMachine.time = new Date(time);
    timeMachine.isActive = true;
    await timeMachine.save();

    triggerTimeMachineNotifications(userID, timeMachine);

    return res.status(200).json(timeMachine);  
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error while updating time machine" });
  }
};

export const resetTimeMachine = async (req, res) => {
  const { userID } = req.body;

  try {
    const timeMachine = await TimeMachine.findOne({ userID });

    if (!timeMachine) {
      return res.status(404).json({ message: "Time machine not found for this user" });
    }

    timeMachine.time = new Date();
    timeMachine.isActive = false;
    await timeMachine.save();

    removeTemporaryTasks(userID);

    return res.status(200).json(timeMachine);  
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error while resetting time machine" });
  }
};
