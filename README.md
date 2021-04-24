# YRHacks 2021 - API Repo
**Team: Adam, Michael, Tim**

## Table of Contents
1. [Top of README](https://github.com/Terra-rian/yrhacks2021#yrhacks-2021---practice-repo)
2. [Auth API Instructions](https://github.com/Terra-rian/yrhacks2021#how-to-use-the-auth-api-experimental)
    - [POST /users](https://github.com/Terra-rian/yrhacks2021#post-on-the-endpoint-users-creates-a-new-user)
    - [POST /auth](https://github.com/Terra-rian/yrhacks2021#post-on-the-endpoint-auth-generates-a-jwt-for-an-existing-user)
    - [POST /auth/refresh](https://github.com/Terra-rian/yrhacks2021#post-on-the-endpoint-authrefresh-generates-a-new-jwt-for-an-existing-user)
    - [GET /users](https://github.com/Terra-rian/yrhacks2021#get-on-the-endpoint-users-lists-all-users "Admin Only!!!")
    - [GET /users/userID](https://github.com/Terra-rian/yrhacks2021#get-on-the-endpoint-usersuserid-gets-a-specific-user)
    - [PATCH /users/userID](https://github.com/Terra-rian/yrhacks2021#patch-on-the-endpoint-usersuserid-updates-the-data-for-a-specific-user)
    - [DELETE /users/userID](https://github.com/Terra-rian/yrhacks2021#delete-on-the-endpoint-usersuserid-removes-a-specific-user "Same User Only / Admin Only!!!")
3. [TODO List](https://github.com/Terra-rian/yrhacks2021#todo-things-to-add-to-the-api)
4. [Notes / Warnings](https://github.com/Terra-rian/yrhacks2021#attention-do-not-publish-this-repository-it-contains-api-keys-and-other-sensitive-data)

## How to use the auth API (experimental):
- There are **7** methods that are implemented with this API:
    - ### **POST** on the endpoint `/users` (creates a new user)
        - You will need to add a JSON payload along with the request, with the following (minimum):
            ```json
            {
                "username": "username",
                "email": "test@gmail.com",
                "password": "password"
            }
            ```
        - Additional parameters supported (in the JSON payload):
            ```json
            {
                "permissionLevel": "a bitfield int > 0"
            }
            ```
        - What it returns:  
            A JSON object containing the ID of the new user in the database, along with a 201 HTTP status.
            ```json
            {
                "id": "a randomly generated ID by MongoDB"
            }
            ```

    - ### **POST** on the endpoint `/auth` (generates a JWT for an existing user)
        - You will need to add a JSON payload along with the request, with the following:
            ```json
            {
                "email": "test@gmail.com",
                "password": "password"
            }
            ```
        - What it returns:  
        A JSON object containing the ID and the randomly generated JWT for an existing user, along with a secondary token and a 201 HTTP status.
            ```json
            {
                "id": "the user's ID in the database",
                "accessToken": "a random JWT",
                "refreshToken": "another random JWT"
            }
            ```

    - ### **POST** on the endpoint `/auth/refresh` (generates a new JWT for an existing user)
        - You will need to add a JSON payload along with the request, with the following:
            ```json
            {
                "refresh_token": "the refresh JWT given from POST /auth"
            }
            ```
        - You will also need to add two headers:
            ```markdown
            Content-Type: application/json
            Authorization: Bearer the original JWT from **POST /auth**
            ```
            **Note:** Remember to prefix the authorization header with `Bearer`, and don't forget the space!
        - What it returns:  
        A JSON object containing a new JWT, a new refresh JWT, and the ID assosciated with the account. It also returns a 201 HTTP status upon success.
            ```json
            {
                "id": "the ID for the account",
                "accessToken": "the new JWT for the account",
                "refreshToken": "the new refresh JWT for the account"
            }
            ```
        - Keep in mind:  
        The **original** `access` JWT and `refresh` JWT are now __invalid__! You must use the newly generated JWTs to access the account! You can also refresh the tokens again by sending another **POST** request to this endpoint, but with the new `refresh` JWT.

    - ### **GET** on the endpoint `/users` (lists all users)
        - **`ADMIN-ONLY`** This endpoint only works for users who have admin privileges (i.e. the bitfield int for `permissionLevel` is larger than 2048)!!!
        - You will need to add two headers:
            ```markdown
            Content-Type: application/json
            Authorization: Bearer the generated JWT from **POST /auth**
            ```
            **Note:** Remember to prefix the Authorization header with `Bearer`, and don't forget the space!
        - What it returns:  
        A JSON array of objects that contain the `username`, `email`, `password` (hashed), `permissionLevel` and `id` for all existing users, along with a 200 HTTP status.
            ```json
            [
                {
                    "_id": "the ID corresponding to the displayed account",
                    "username": "username",
                    "email": "test@gmail.com",
                    "password": "password",
                    "permissionLevel": "the bitfield int for the permissions of the displayed account",
                    "__v": 0,
                    "id": "the ID corresponding to the displayed account"
                }
            ]
            ```

    - ### **GET** on the endpoint `/users/userID` (gets a specific user)
        - **Note:** Make sure to replace `userID` with the actual ID of the user in the database!
        - You will need to add two headers:
            ```markdown
            Content-Type: application/json
            Authorization: Bearer the generated JWT from **POST /auth**
            ```
            **Note:** Remember to prefix the Authorization header with `Bearer`, and don't forget the space!
        - What it returns:  
        A JSON object containing the `username`, `email`, `password` (hashed), `permissionLevel` and `id` for the provided user ID, along with a 200 HTTP status.
            ```json
            {
                "username": "username",
                "email": "test@gmail.com",
                "password": "the hashed password",
                "permissionLevel": "a bitfield int",
                "id": "the unique ID for that account"
            }
            ```

    - ### **PATCH** on the endpoint `/users/userID` (updates the data for a specific user)
        - **Note:** Make sure to replace `userID` with the actual ID of the user in the database!
        - You will need to add a JSON payload along with the request, containing the following:
            ```json
            {
                "username": "the new username",
                "email": "newemail@gmail.com",
                "password": "newpassword",
                "permissionLevel": "a new bitfield int" // TODO: make this available only to admins
            }
            ```
        - What it returns:  
        A 204 HTTP status as confirmation of a successfull patch. You can request the user info through **GET /users/userID** to check what changed.

    - ### **DELETE** on the endpoint `/users/userID` (removes a specific user)
        - **`SAME-USER-ONLY / ADMIN-ONLY`** This endpoint only works if you are the user you are trying to delete (or if you have admin privileges)!!!
        - **Note:** Make sure to replace `userID` with the actual ID of the user in the database!
        - You will need to add two headers:
            ```markdown
            Content-Type: application/json
            Authorization: Bearer the generated JWT from **POST /auth**
            ```
            **Note:** Remember to prefix the Authorization header with `Bearer`, and don't forget the space!
        - What it returns:  
        A 204 HTTP status as confirmation of a successfull delete. You can check if the user was deleted through **GET /users** (**`ADMIN-ONLY`**).

## TODO: Things to add to the API:
- Implementation of proper validation
    - Making sure user emails / usernames are unique

- Implementation of unit testing / error reporting
    - Add a way to send error messages in a user-friendly way
    - Send useful data to a webhook for quick debugging

- A way to prevent users from changing their own / others' permission levels

- A way to prevent admins from deleting their own accounts (without confirmation at least)

- Remove disclosure of passwords (even hashed ones)

- Image Upload Api (Preferrably with 256kb file limit, need to store image, id, image name, visibility [public/private], owner id, times retrieved)

- Image edit api (Change visibility)

- Image retrieval api (Downloads images by image id, only require authorization for private images)

- Image deletion api (Deletes images by id, only allows owner to delete, or admin)

- Image list api (List all images by an owner id. Api returns image id, name, visibility, owner id, and times retrieved)

- Image search api (Searches public images by name)

- Image top api (Lists top retrieved images)

## **Attention: Do not publish this repository, it contains API keys and other sensitive data!**
