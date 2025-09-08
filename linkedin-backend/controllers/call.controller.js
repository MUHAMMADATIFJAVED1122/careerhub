import Call from "../models/call.model.js";

// Start a call
export const startCall = async (req, res) => {
  try {
    const { receiverId, callType } = req.body;

    const call = await Call.create({
      caller: req.user.id,
      receiver: receiverId,
      callType,
    });

    res.json(call);
  } catch (error) {
    res.status(500).json({ error: "Failed to start call" });
  }
};

// End a call
export const endCall = async (req, res) => {
  try {
    const call = await Call.findById(req.params.id);

    if (!call) return res.status(404).json({ error: "Call not found" });

    if (call.caller.toString() !== req.user.id && call.receiver.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to end this call" });
    }

    call.status = "ended";
    call.endedAt = new Date();
    await call.save();

    res.json({ success: true, message: "Call ended", call });
  } catch (error) {
    res.status(500).json({ error: "Failed to end call" });
  }
};

// Get user call history
export const getCallHistory = async (req, res) => {
  try {
    const calls = await Call.find({
      $or: [{ caller: req.user.id }, { receiver: req.user.id }],
    })
      .populate("caller receiver", "username profilePicture")
      .sort({ createdAt: -1 });

    res.json(calls);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch call history" });
  }
};
