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

## SQL Relationship
[![image][[https://img5.pic.in.th/file/secure-sv1/Screenshot-2567-06-20-at-22.53.24.png](https://img5.pic.in.th/file/secure-sv1/Screenshot-2567-06-20-at-22.53.24.png)]

## API detail..
### Register
``` bash
POST /register
```

Parameter |  Type | Description | Required |
----- | ----- | ----- | ----- |
username |   string| your username | required |
email |   string| your email | required |
password |   string| your password pattern (a-z , A-Z , 0-9) and special characters | required |

Responses :
``` bash
{
    "username": string,
    "email": string,
    "token": THIS_JWT_TOKEN
}
```

### login
``` bash
POST /login
```

Parameter |  Type | Description | Required |
----- | ----- | ----- | ----- |
email |   string| your email | required |
password |   string| your password pattern (a-z , A-Z , 0-9) and special characters | required |

Responses :
``` bash
{
    "username": string,
    "email": string,
    "token": JWT_TOKEN
}
```
❗️❗️❗️
### headers
``` bash
{ x-access-token : JWT_TOKEN }
```

headers | Description | Required |
----- | ----- | ----- | 
x-access-token | JWT require when your call CRUD API in this project | required |

### CRUD API
don't forgot use headers!!
🔽🔽🔽🔽🔽🔽🔽🔽

### Find user

find all : 
``` bash
GET /user/all
```

find one :
``` bash
GET /user/info/{email}
```

Responses :
``` bash
[
    {
        "user_id": number,
        "username": string,
        "email": string,
        "password": string (hash),
        "created_at": string (date),
        "updated_at": string (date)
    }
]
```
### Delete user
``` bash
DELETE /user/delete
```

Parameter |  Type | Description | Required |
----- | ----- | ----- | ----- |
email |   string| your email | required |

Responses :
``` bash
{
    "status": "Delete success"
}
```

### Update user
``` bash
PATCH /user/update
```

Parameter |  Type | Description | Required |
----- | ----- | ----- | -----|
email |   string| your email | required |
newPassword |   string| new email to update| optional |
newUsername |   string| new username to update| optional |
newEmail |   string| new email to update| optional |

Responses :
``` bash
{
    "status": "update success"
}
```

### Find tasks

find all : 
``` bash
GET /task/all
```

find one :
``` bash
GET /task/info/{task_id}
```

Responses :
``` bash
[
    {
        "task_id": number,
        "user_id": number,
        "title": string,
        "description": string,
        "status": string ("pending","in_progress","completed"),
        "priority": string ("low","medium","high"),
        "due_date": string (date),
        "created_at": string (date),
        "updated_at": string (date)
    }
]
```

### Create tasks
``` bash
POST /task/create
```

Parameter |  Type | Description | Required |
----- | ----- | ----- | ----- | 
title |   string| task title | required |
description |   string| task description | required |
due_date |   string| task end. fommat (YYYY-MM-DD)| required | 

Responses :
``` bash
{
    "status": "insertsuccess"
}
```

### Update tasks
``` bash
PATCH /task/update
```

Parameter |  Type | Description | Required |
----- | ----- | ----- | ----- | 
task_id |   number | task id to update | required |
title |   string| task title | optional |
description |   string| task description| optional |
due_date |   string| task end. fommat (YYYY-MM-DD)| optional | 
status |   string| task status. Only ("pending","in_progress","completed") | optional |
priority |   string| task priority. Only ("low","medium","high") | optional |

Responses :
``` bash
{
    "status": "update success"
}
```

### Delete tasks
``` bash
DELETE /task/update
```

Parameter |  Type | Description | Required |
----- | ----- | ----- | ----- |
task_id |   number | task id to delete | required |

Responses :
``` bash
{
    "status": "Delete success"
}
```

### Find comments
find with task_id : 
``` bash
GET /task/comment/{task_id}
```

find one :
``` bash
GET /task/info/{task_id}
```

Responses :
``` bash
[
    {
        "task_id": number,
        "user_id": number,
        "title": string,
        "description": string,
        "status": string ("pending","in_progress","completed"),
        "priority": string ("low","medium","high"),
        "due_date": string (date),
        "created_at": string (date),
        "updated_at": string (date),
        "comment": [
            {
                "comment_id": number,
                "task_id": number,
                "user_id": number,
                "comment": string,
                "created_at": string (date),
                "updated_at": string (date)
            }
        ]
    }
]
```

### Create comment (in task)
``` bash
POST ask/comment/create
```

Parameter |  Type | Description | Required |
----- | ----- | ----- | ----- | 
task_id |   number| comment to this tasks | required |
comment |   string| comment detail | required |

Responses :
``` bash
{
    "status": "insertsuccess"
}
```

### Update comment
``` bash
PATCH /task/comment/update
```

Parameter |  Type | Description | Required |
----- | ----- | ----- | ----- | 
comment_id |   number | update to this comment  | required |
comment |   string| new comment detail to update | required |

Responses :
``` bash
{
    "status": "update success"
}
```

### Delete comments
``` bash
DELETE /task/comment/delete
```

Parameter |  Type | Description | Required |
----- | ----- | ----- | ----- |
comment_id |   number | comment_id to delete | required |

Responses :
``` bash
{
    "status": "Delete success"
}
```

##Status Code
Status Code | Description |
----- | ----- | 
200 |   OK |
201 |   CREATED |
400 |   BAD REQUEST |
404 |   NOT FOUND |
409 |   Conflict |
500 |   INTERNAL SERVER ERROR |

## END !!!! 💋
Thank you for reading and enjoy to develop....
























