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

//   app.get('/budget', (req, res) => {
//     const data=require('./new.json')
//     res.json(data);
//   });
  

// Endpoint to fetch budget data
// app.get('/budget', async (req, res) => {
//     try {
//         const budgetData = await Budget.find({});
//         res.json({ myBudget: budgetData });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // Endpoint to add a new budget item
// app.post('/budget/post', async (req, res) => {
//     try {
//         title = req.body.title;
//         value=req.body.value;
//         color=req.body.color;
//         const newBudget = new Budget({ title, value, color });
//         await newBudget.save();
//         res.status(201).json({ message: 'Budget data added successfully.' });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });


// Add this after the previous endpoints


//hex

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

app.post('/budget/post', async (req, res) => {
    try {
        const { title, value, color } = req.body;

        // Validate fields
        if (!title || !value || !color) {
            return res.status(400).json({ error: 'All fields (title, value, color) are required.' });
        }

        // Convert color to hexadecimal format
        const hexColor = `#${color}`;

        const newBudget = new Budget({ title, value, color: hexColor });
        await newBudget.save();
        res.status(201).json({ message: 'Budget data added successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});





// Endpoint to update a budget item by ID
app.put('/budget/:id', async (req, res) => {
    try {
        const { title, value, color } = req.body;
        const updatedBudget = await Budget.findByIdAndUpdate(req.params.id, { title, value, color }, { new: true });
        res.json({ message: 'Budget data updated successfully.', updatedBudget });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
