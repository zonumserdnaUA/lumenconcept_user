# Requirements
##### Install couchDB
    http://couchdb.apache.org/

##### Create an user admin for couchDB
    http://127.0.0.1:5984/_utils/#addAdmin/couchdb@localhost
    login: admin
    pwd: admin

##### Create database "users"
    http://127.0.0.1:5984/_utils/#/_all_dbs

##### Install node js (LTS)
    https://nodejs.org/es/

##### Install node modules
    cd \lumenconcept_user
    npm install

##### Run project
    cd \lumenconcept_user
    npm start

# Requests documentation
| Method | Endpoint | Required data | Description |
| ------ | ------ | ------- |  ------- |
| POST | /api/user | N/A | Create an user |
| GET | /api/user | N/A | Get all users |
| GET | /api/user/:userId | N/A | Get the user which matches with userId |
| PUT | /api/user/:userId | {"param_1": "value"}| Updates the user with provided data|
| DELETE | /api/user/:userId |

# User structure
```json
{
    "userName": "the-user-name",
    "userLastName": "the-user-last-name",
    "email": "theuser@email.com",
    "phone": "00000000",
    "age": 40,
    "other-params": "we-are-able-to-design"
}
```