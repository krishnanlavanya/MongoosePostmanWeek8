const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;

const budgetSchema = new mongoose.Schema({
    title: { type: String, required: true, unique:true },
    value: { type: Number, required: true },
    color: {
        type: String,
        required: true,
        validate: {
            validator: function (color) {
                // Validate color format (hexadecimal, at least 6 digits)
                const hexColorRegex = /^#[0-9A-Fa-f]{6,}$/;
                return hexColorRegex.test(color);
            },
            message: 'Color must be in at least 6 digits hexadecimal format (e.g., #ED4523).'
        }
    }
});

module.exports = mongoose.model('Budget', budgetSchema);
 

