const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
let jsonData = {};


const port = 4000;
const corsOptions = {
    origin: 'http://localhost:3000'
};

app.use(cors(corsOptions));
app.get('/', (req,res) => {
    res.send('Hello World');
});

function readUserJson() {
    fs.readFile('./users.json', 'utf8', (err, data) => {
        if(err){
            console.error(err);
        }
        try {
            jsonData = JSON.parse(data);
        }
        catch(parseErr) {
            console.error(parseErr);
        }
    });
}

app.get('/users', (req,res) => {
    const userList = jsonData.map((user) => {
        return {
            id: user.id,
            fName: user.first_name,
            lName: user.last_name
        };
    });
    res.send(userList);
});

app.get('/users/:id', (req,res) => {
    const paramId = parseInt(req.params.id);
    const userList = jsonData.map((user) => {
        return {
            id: user.id,
            fName: user.first_name,
            lName: user.last_name,
            avatar: user.avatar,
            email: user.email,
            emailVerified: user.emailVerified,
            dob: user.dob,
            company: {
                name: user.company.name,
                department: user.company.department
            },
            skills: user.skills
        };
    });
    const filteredUser = userList.find(user => user.id === paramId);
    if(filteredUser){
        res.send(filteredUser);
    } else {
        res.status(404).send('User Not Found');
    }  
});

app.listen(port, () => {
    readUserJson();
    console.log(`Server started on Port: ${port}`);
});