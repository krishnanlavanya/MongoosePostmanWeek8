const express = require('express');
const app= express();
const port = 3000;
const mongoose = require("mongoose")
const bodyParser = require('body-parser');
const Budget = require('./budgetModel')

const url = 'mongodb://127.0.0.1:27017/database_lava'; 

app.use(bodyParser.json());

app.use('/', express.static('public'));

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/hello', (req, res) => {
    res.send('Hello World!');
  });


app.get('/budget', async (req, res) => {
    try {
        const budgetData = await Budget.find({});
        // Convert colors to original format (without the leading '#')
        const formattedBudgetData = budgetData.map(item => ({
            title: item.title,
            value: item.value,
            color: item.color.slice(1) // Remove the leading '#'
        }));
        res.json({ myBudget: formattedBudgetData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




app.post('/budget', async (req, res) => {
    try {
        const { title, value, color } = req.body;

        // Find a budget item with the given title
        let existingBudget = await Budget.findOne({ title });

        if (existingBudget) {
            // Update the existing budget item
            existingBudget.value = value;
            existingBudget.color = color;
            await existingBudget.save();
            res.json({ message: 'Budget data updated successfully.', updatedBudget: existingBudget });
        } else {
            // Create a new budget item
            const newBudget = new Budget({ title, value, color });
            await newBudget.save();
            res.status(201).json({ message: 'Budget data added successfully.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
