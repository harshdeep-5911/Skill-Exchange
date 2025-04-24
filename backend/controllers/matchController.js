import User from "../models/User.js";

export const getMatches = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId);

    const matches = await User.aggregate([
      {
        $match: {
          _id: { $ne: currentUser._id },
          skills: { $in: currentUser.lookingFor || [] },
          lookingFor: { $in: currentUser.skills || [] },
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          skills: 1,
          lookingFor: 1,
        },
      },
    ]);

    res.json(matches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching matches" });
  }
};

export const getMatchesBySkill = async (req, res) => {
  try {
    const { skill } = req.query;
    const currentUser = await User.findById(req.user.userId);

    const matches = await User.find({
      _id: { $ne: currentUser._id },
      skills: skill,
    }).select("name email skills");

    res.json(matches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching matches by skill" });
  }
};
