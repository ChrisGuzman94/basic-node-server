const mongoose = require("mongoose");

messageSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  segId: { type: String, required: true },
  options: [
    {
      elmPos: { type: String, required: true },
      elmName: { type: String, required: true },
      input: { type: String, required: true },
      show: { type: Boolean, required: true },
      default: { type: Boolean, required: true },
      choice: { type: Boolean, required: true }
    }
  ]
});

module.exports = mongoose.model("Message", messageSchema);
