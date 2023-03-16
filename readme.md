# Acronym API


This is a simple REST API for managing acronyms. It allows you to perform basic CRUD operations on acronyms, with support for pagination and fuzzy search.


## Requirements
To run this project, you will need to have:

Node.js (v12 or higher)
MongoDB (v4.2 or higher)
  Install MongoDB Community Edition on macOS > https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/
  Install MongoDB Community Edition on Ubuntu > https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/
  Install MongoDB Community Edition on Windows > https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/


## Installation

To install and run this API, you'll need to have Node.js and MongoDB installed on your system. 


### Pull the API repo

* Clone this repository to your local machine from `git clone https://github.com/charles-philippe/fullhaus-acronym-api.git`
* Change into directory using `cd fullhaus-acronym-api`
* Install the dependencies by running `npm install` in the project directory.

### Setup local database

* Check that you have mongo db installed `mongod --version` if this errors please install Mongo db from the above 'Requirements' link
* Start the MongoDB Server using `npm run start-mongo`
* Create the Mongo DB `acronyms_db` and the `acronyms` collection.
* Seed the Mongo DB with `npm run db-seed-data`

### Start the API Server
* Add .env file supplied at the to the root of the `fullhaus-acronym-api` folder.
* Run the API server using `npm start`


## Usage

Here are the endpoints that you can use to interact with the API:

*  `GET /acronym?page=1&limit=10&search=:search:` returns a list of acronyms, with pagination using query parameters. The response headers indicate if there are more results. This endpoint returns all acronyms that fuzzy match against :search.
*  `POST /acronym:` receives an acronym and definition string, and adds the acronym definition to the db.
*  `PATCH /acronym/:acronymID:` updates the acronym for :acronymID.
*  `DELETE /acronym/:acronymID:` deletes the acronym for :acronymID.


## Examples

Here are some examples of how to use the API with the curl command-line tool:


Get all acronyms:
'''bash
curl http://localhost:3000/acronym
'''

Get acronyms that match a fuzzy search:
'''bash
curl http://localhost:3000/acronym?search=2
'''

Add a new acronym:
'''bash
curl -X POST -H "Content-Type: application/json" -d '{"acronym":"API", "definition":"Application Programming Interface"}' http://localhost:3000/acronym
'''

Update an existing acronym:
'''bash
curl -X PATCH -H "Content-Type: application/json" -d '{"definition":"Updated definition"}' http://localhost:3000/acronym/507f191e810c19729de860eb
'''

Delete an existing acronym:
'''bash
curl -X DELETE http://localhost:3000/acronym/507f191e810c19729de860eb
'''

## Routes
Endpoints available:

### GET /acronym

Returns a list of matching acronyms based on query parameters page, limit and search.

#### Request

Headers

```json
{
    "authorization": "Bearer MY_SECRET_TOKEN"
}
```

#### Query Parameters

```json
    ?page=<number>&limit=<number>&search=<string>
```

#### Response

```json
Status: 200 OK
X-Has-Next-Page: true
[
    {"_id": "60aacf7d82824e3a044b0615", "acronym": "API", "definition": "Application Programmable Interface" },
    {"_id": "60aacf7d82824e3a044b0616", "acronym": "CSS", "definition": "Cascading Style Sheets" }
]
```


ETC...


## Security

All the routes require Bearer MY_SECRET_TOKEN to authorize access. The token should be passed in the authorization field in the headers of each request. If no token or an invalid token is provided, the response is 401 Unauthorized.

The middleware function helmet() adds security-related headers to the HTTP response for secured servers.

```js
curl -H "Authorization: Bearer MY_SECRET_TOKEN" http://localhost:3000/example
```


## License
This API is licensed under the MIT License.


## .env file contents

```js
PORT=3000
DATABASE_URL=mongodb://localhost:27017/acronyms_db
SECRET_KEY=my-secret-key
```