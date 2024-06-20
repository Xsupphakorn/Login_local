# Demo API Login and CRUD with JWT 

this project work on commonJS ✅

## API list !!!
* Register
* Login
* User (CRUD)
* Tasks (CRUD)
* Comment (CRUD)

this manager API in project use JWT for security!!!

## Getting start!!! 📣📣
1.Clone this repository.
2.Install dependencies:
``` bash
npm install
```
3.Create a .env file in the project root directory and add the following environment variable:
``` bash
TOKEN_SECRET=your_secret_key_here
MYSQL=your_host_sql
MYSQL_PORT=your_port_sql
MYSQL_USER=your_user_sql
MYSQL_PASSWORD=your_password_sql
```

4.Start the server:
``` bash
node index.js
```

## API detail..
### Register
``` bash
POST /register
```

 Parameter |  Type | Description |
 ----- | ----- | ----- |
  username |   string| your username |
  email |   string| your email |
  password |   string| your password pattern (a-z , A-Z , 0-9) and special characters |







