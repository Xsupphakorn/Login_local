require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const mysql = require('mysql');
const sqlmodule = require('./database/database.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtauth = require('./middle/jwtauth.js');
const Joi = require('joi');
const { validationMiddleware, userSchema } = require('./middle/validation.js');

const app = express();
const port = 3340;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/register', validationMiddleware(userSchema), (req, res) => {
    //register
    async function register() {
        try {
            //input
            const { username, email, password } = req.body;

            //vaildation
            if (!username && !email && !password) {
                return res.status(400).json({ error: "All fields are required" });
            }
            //check if user already exists
            var database = "data_project";
            var table = "user";
            var query = { key : "email", query: email };
            var olduser = await sqlmodule.sqlfind(database, table, query);
            if (olduser.length > 0) {
                return res.status(409).json({ error: "User already exists. Please login" });
            }

            //hash password
            hashPassword = await bcrypt.hash(password, 10);

            //insert data
            var database = "data_project";
            var table = "user";
            var insert = { username: username, email: email.toLowerCase(), password: hashPassword };
            var insertuser = await sqlmodule.sqlinsert(database, table, insert);

            //find user
            var query = { key : "email", query: email.toLowerCase() };
            var user = await sqlmodule.sqlfind(database, table, query);

            //user id
            var user_id = user[0].user_id;

            //create token
            var token = jwt.sign({ username: username, email, user_id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });

            //response
            var result = { username: username, email: email, token: token };

            res.status(201).json(result);


        } catch (error) {
            console.log("error : " + error);
        }
    }
    register()
});

app.post('/login', validationMiddleware(userSchema), (req, res) => {
    async function login() {
        try {
            //login
            const { email, password } = req.body;

            //vaildation
            if (!email && !password) {
                return res.status(400).json({ error: "All fields are required" });
            }

            //check if user exists
            var database = "data_project";
            var table = "user";
            var query = { key : "email", query: email.toLowerCase() };
            var user = await sqlmodule.sqlfind(database, table, query);
            if (user.length == 0) {
                return res.status(404).json({ error: "User does not exist. Please register" });
            }

            //check password
            const validPassword = await bcrypt.compare(password, user[0].password);
            if (!validPassword) {
                return res.status(401).json({ error: "Invalid password" });
            }

            //user id
            var user_id = user[0].user_id;

            //create token
            var token = jwt.sign({ username: user[0].username, email, user_id}, process.env.TOKEN_SECRET, { expiresIn: '1h' });

            //response
            var result = { username: user[0].username, email: email, token: token };
            res.status(200).json(result);

            
        } catch (error) {
            console.log("error : " + error);
        }

    }
    login();
});

app.get('/user/all', jwtauth, (req, res) => {
    async function userinfo() {
        try {
            //get alluser 
            var database = "data_project";
            var table = "user";
            var alluser = await sqlmodule.sqlall(database, table);

            res.status(200).json(alluser);
            
        } catch (error) {
            console.log("error : " + error);
        }
    }
    userinfo();
});

app.get('/user/info/:email', jwtauth, validationMiddleware(userSchema),(req, res) => {
    async function userinfo() {
        try {
            //get one user info
            const email = req.params.email;

            //vaildation
            if (!email) {
                return res.status(400).json({ error: "Email is required" });
            }
            var database = "data_project";
            var table = "user";
            var query = { key : "email", query: email };
            var user = await sqlmodule.sqlfind(database, table, query);

            res.status(200).json(user);
            
        } catch (error) {
            console.log("error : " + error);
        }
    }
    userinfo();
});

app.patch('/user/update', jwtauth, validationMiddleware(userSchema),(req, res) => {
    async function userupdate() {
        try {

            //update user info
            const { email } = req.body;

            var database = "data_project";
            var table = "user";
            var dataUpdate = [];

            //vaildation
            if (!email) {
                return res.status(400).json({ error: "Email are required" });
            }

            //update password
            if (req.body.newPassword) {
                var newPassword = req.body.newPassword;
                //hash password
                hashPassword = await bcrypt.hash(newPassword, 10);
                //push data
                dataUpdate.push({key: "password",newvalues: hashPassword });
            }

            //update username
            if (req.body.newUsername) {
                var newUsername = req.body.newUsername;

                //check if username already exists
                var query = { key : "username", query: newUsername };
                var olduser = await sqlmodule.sqlfind(database, table, query);
                if (olduser.length > 0) {
                    return res.status(409).json({ error: "Username already exists. Please try another username" });
                }
                //push data
                dataUpdate.push({key: "username",newvalues: newUsername});
            }

            //update email
            if (req.body.newEmail) {
                var newEmail = req.body.newEmail;

                //check if email already exists
                var query = { key : "email", query: newEmail };
                var olduser = await sqlmodule.sqlfind(database, table, query);
                if (olduser.length > 0) {
                    return res.status(409).json({ error: "Email already exists. Please try another email" });
                }
                //push data
                dataUpdate.push({key: "email",newvalues: newEmail });
            }

            //update data
            var query = { key : "email", query: email };
            var newvalues = dataUpdate;
            console.log("========");
            console.log(newvalues);
            var user = await sqlmodule.sqlupdate(database, table, query, newvalues);

            res.status(200).json(user);
            
        } catch (error) {
            console.log("error : " + error);
        }
    }
    userupdate();
});

app.delete('/user/delete', jwtauth, validationMiddleware(userSchema),(req, res) => {
    async function userdelete() {
        try {
            //delete user
            const { email } = req.body;
            var database = "data_project";
            var table = "user";
            var query = { key : "email", value: email };

            //vaildation
            if (!email) {
                return res.status(400).json({ error: "Email is required" });
            }

            //delete data
            var user = await sqlmodule.sqldelete(database, table, query);

            res.status(200).json(user);
            
        } catch (error) {
            console.log("error : " + error);
        }
    }
    userdelete();
});

app.post('/task/create', jwtauth, validationMiddleware(userSchema), (req, res) => {
    async function taskcreate() {
        try {
            //create task
            const { title, description, due_date } = req.body;

            //get user id
            var user_id = req.user.user_id;

            var database = "data_project";
            var table = "tasks";

            var datainsert = {  user_id: user_id, title: title, description: description, due_date: due_date};

            //check status
            if (req.body.status) {
                var status = req.body.status;
                if (status != "pending" && status != "in_progress" && status != "completed") {
                    return res.status(400).json({ error: "Status must be pending, in_progress or completed" });
                }
                datainsert.status = status;
            } 

            //check priority
            if (req.body.priority) {
                var priority = req.body.priority;
                if (priority != "low" && priority != "medium" && priority != "high") {
                    return res.status(400).json({ error: "Priority must be low, medium or high" });
                }
                datainsert.priority = priority;
            }

            //vaildation
            if (!title && !description && !due_date) {
                return res.status(400).json({ error: "All fields are required" });
            }

            //insert data
            var tasks = await sqlmodule.sqlinsert(database, table, datainsert);

            res.status(201).json(tasks);
            
        } catch (error) {
            console.log("error : " + error);
        }
    }
    taskcreate();
});

app.get('/task/all', jwtauth, validationMiddleware(userSchema),(req, res) => {
    async function taskall() {
        try {
            //get all task
            var database = "data_project";
            var table = "tasks";
            var alltask = await sqlmodule.sqlall(database, table);

            res.status(200).json(alltask);
            
        } catch (error) {
            console.log("error : " + error);
        }
    }
    taskall();
});

app.get('/task/info/:task_id', jwtauth, validationMiddleware(userSchema),(req, res) => {
    async function taskinfo() {
        try {
            //get one task info
            const task_id = req.params.task_id;

            //vaildation
            if (!task_id) {
                return res.status(400).json({ error: "Task ID is required" });
            }
            var database = "data_project";
            var table = "tasks";
            var query = { key : "task_id", query: task_id };
            var task = await sqlmodule.sqlfind(database, table, query);

            res.status(200).json(task);
            
        } catch (error) {
            console.log("error : " + error);
        }
    }
    taskinfo();
});

app.patch('/task/update', jwtauth, validationMiddleware(userSchema),(req, res) => {
    async function taskupdate() {
        try {
            //update task info
            const { task_id } = req.body;
            var database = "data_project";
            var table = "tasks";
            var dataUpdate = [];

            //vaildation
            if (!task_id) {
                return res.status(400).json({ error: "Task ID is required" });
            }

            //update title
            if (req.body.title) {
                var title = req.body.title;
                //push data
                dataUpdate.push({key: "title",newvalues: title });
            }

            //update description
            if (req.body.description) {
                var description = req.body.description;
                //push data
                dataUpdate.push({key: "description",newvalues: description });
            }

            //update due_date
            if (req.body.due_date) {
                var due_date = req.body.due_date;
                //push data
                dataUpdate.push({key: "due_date",newvalues: due_date });
            }

            //update status
            if (req.body.status) {
                var status = req.body.status;
                if (status != "pending" && status != "in_progress" && status != "completed") {
                    return res.status(400).json({ error: "Status must be pending, in_progress or completed" });
                }
                //push data
                dataUpdate.push({key: "status",newvalues: status });
            }

            //update priority
            if (req.body.priority) {
                var priority = req.body.priority;
                if (priority != "low" && priority != "medium" && priority != "high") {
                    return res.status(400).json({ error: "Priority must be low, medium or high" });
                }
                //push data
                dataUpdate.push({key: "priority",newvalues: priority });
            }

            //update data
            var query = { key : "task_id", query: task_id };
            var newvalues = dataUpdate;
            var task = await sqlmodule.sqlupdate(database, table, query, newvalues);

            res.status(200).json(task);
            
        } catch (error) {
            console.log("error : " + error);
        }
    }
    taskupdate();
});

app.delete('/task/delete', jwtauth, validationMiddleware(userSchema),(req, res) => {
    async function taskdelete() {
        try {
            //delete task
            const { task_id } = req.body;
            var database = "data_project";
            var table = "tasks";
            var query = { key : "task_id", value: task_id };

            //vaildation
            if (!task_id) {
                return res.status(400).json({ error: "Task ID is required" });
            }

            //delete data
            var task = await sqlmodule.sqldelete(database, table, query);

            res.status(200).json(task);
            
        } catch (error) {
            console.log("error : " + error);
        }
    }
    taskdelete();
});

app.get('/task/comment/:task_id', jwtauth, validationMiddleware(userSchema),(req, res) => {
    async function taskcomment() {
        try {
            //view comment
            const task_id = req.params.task_id;
            var database = "data_project";
            var table = "comments";

            //vaildation
            if (!task_id) {
                return res.status(400).json({ error: "Task ID is required" });
            }

            //get task
            var tabletask = "tasks";
            var querytask = { key : "task_id", query: task_id };
            var task = await sqlmodule.sqlfind(database, tabletask, querytask);

            //check if task exists
            if (task.length == 0) {
                return res.status(404).json({ error: "Task does not exist" });
            }

            var query = { key : "task_id", query: task_id };
            var comment = await sqlmodule.sqlfind(database, table, query);

            //check if comment exists
            if (comment.length == 0) {
                comment = { message: "No comment for this task"}
            }

            //response task and comment
            task[0].comment = comment;

            res.status(200).json(task);
            
        } catch (error) {
            console.log("error : " + error);
        }
    }
    taskcomment();
});

app.get('/comment/:comment_id', jwtauth, validationMiddleware(userSchema),(req, res) => {
    async function taskcomment() {
        try {
            //get one comment
            const comment_id = req.params.comment_id;
            var database = "data_project";
            var table = "comments";
            var query = { key : "comment_id", query: comment_id };
            var comment = await sqlmodule.sqlfind(database, table, query);

            res.status(200).json(comment);
            
        } catch (error) {
            console.log("error : " + error);
        }
    }
    taskcomment();
});


app.post('/task/comment/create', jwtauth, validationMiddleware(userSchema),(req, res) => {
    async function taskcomment() {
        try {
            //create comment
            const { task_id, comment} = req.body;

            //get user id
            var user_id = req.user.user_id;

            var database = "data_project";
            var table = "comments";

            //vaildation
            if (!task_id && !comment) {
                return res.status(400).json({ error: "Task ID and comment are required" });
            }

            //insert data
            var datainsert = { task_id: task_id, comment: comment, user_id: user_id};
            var comments = await sqlmodule.sqlinsert(database, table, datainsert);

            res.status(201).json(comments);
            
        } catch (error) {
            console.log("error : " + error);
        }
    }
    taskcomment();
});

app.patch('/task/comment/update', jwtauth, validationMiddleware(userSchema),(req, res) => {
    async function taskcomment() {
        try {
            //update comment
            const { comment_id , comment } = req.body;
            var database = "data_project";
            var table = "comments";

            //vaildation
            if (!comment_id && !comment) {
                return res.status(400).json({ error: "Comment ID and Comment is required" });
            }

            //update data
            var query = { key : "comment_id", query: comment_id };
            var newvalues = [{ key: "comment",newvalues: comment }];
            var comments = await sqlmodule.sqlupdate(database, table, query, newvalues);

            res.status(200).json(comments);
            
        } catch (error) {
            console.log("error : " + error);
        }
    }
    taskcomment();
});

app.delete('/task/comment/delete', jwtauth, validationMiddleware(userSchema),(req, res) => {
    async function taskcomment() {
        try {
            //delete comment
            const { comment_id } = req.body;
            var database = "data_project";
            var table = "comments";
            var query = { key : "comment_id", value: comment_id };

            //vaildation
            if (!comment_id) {
                return res.status(400).json({ error: "Comment ID is required" });
            }

            //delete data
            var comments = await sqlmodule.sqldelete(database, table, query);

            res.status(200).json(comments);
            
        } catch (error) {
            console.log("error : " + error);
        }
    }
    taskcomment();
});




app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});