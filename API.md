# EmojiPacks (pax?) API Specification

## Table of Contents

- [EmojiPacks (pax?) API Specification](#emojipacks-pax-api-specification)
  - [Table of Contents](#table-of-contents)
  - [Global Definitions](#global-definitions)
  - [Data Structures](#data-structures)
    - [Account Object (Minimum Storage Requirement)](#account-object-minimum-storage-requirement)
    - [Pack Object (Minimum Storage Requirement)](#pack-object-minimum-storage-requirement)
    - [Emoji Object (Minimum Storage Requirement)](#emoji-object-minimum-storage-requirement)
  - [Account API](#account-api)
    - [Registration (`POST` - `/register`)](#registration-post---register)
    - [Login (`POST` - `/login`)](#login-post---login)
    - [Get User (`GET` - `/user/{userid}`)](#get-user-get---queryuseruserid)
  - [Emoji Pack API](#emoji-pack-api)
    - [Create Pack (`POST` - `/pack/create`)](#create-pack-post---packcreate)
    - [Get Pack (`GET` - `/pack/{packid}`)](#get-pack-get---packpackid)
    - [Edit Pack (`PATCH` - `/pack/edit`)](#edit-pack-patch---packedit)
    - [Delete Pack (`DELETE` - `/pack/delete`)](#delete-pack-delete---packdelete)
    - [Clone Pack (`POST` - `/pack/clone`)](#clone-pack-post---packclone)
  - [Emoji API](#emoji-api)
    - [Upload Emoji (`POST` - `/pack/upload/{packid}`)](#upload-emoji-post---packuploadpackid)
    - [Edit Emoji (`PATCH` - `/emoji/edit`)](#edit-emoji-patch---emojiedit)
    - [Delete Emoji (`DELETE` - `/emoji/delete`)](#delete-emoji-delete---emojidelete)
    - [Clone Emoji (`POST` - `/emoji/clone`)](#clone-emoji-post---emojiclone)
    - [Get Emoji (`GET` - `/emoji/{emojiid}`)](#get-emoji-get---emojiemojiid)
    - [Load Emoji (`GET` - `/emoji/load/{emojiid}`)](#load-emoji-get---emojiloademojiid)
  - [Query API](#query-api)
    - [Query Pack Emojis (`POST` - `/query/pack/{packid}`)](#query-pack-emojis-post---querypackpackid)
    - [Query Packs (`POST` - `/query/global/packs`)](#query-packs-post---queryglobalpacks)
    - [Query Global Emojis (`POST` - `/query/global`)](#query-global-emojis-post---queryglobal)
    - [Query Top Emojis (`POST` - `/query/top`)](#query-top-emojis-post---querytop)

## Global Definitions

```json
{
    "MAX_PACK_SIZE": 50,
    "MAX_PACK_COUNT": 10
}
```

## Data Structures

There will be different types of data that need to be exposed by the api. Additional information may be stored for operation in the backend.

### Account Object (Minimum Storage Requirement)

- Account Username
- Account Id
- Account Packs (List of pack ids)

### Pack Object (Minimum Storage Requirement)

- Pack Name
- Pack Owner
- Pack Id
- Pack Emojis (List of emoji ids)
- Visibility

### Emoji Object (Minimum Storage Requirement)

- Emoji Name (without extension)
- Emoji File Extension (For copying into the clipboard)
- Emoji Pack (Pack that this emoji belongs to)
- Emoji Owner
- Copy Count (Number of times the Emoji was copied by another user)

## Account API

### Registration (`POST` - `/register`)

- Payload:
  Post a JSON payload to the endpoint with the following:

  ```json
  {
      "username": "username",
      "password": "password"
  }
  ```

- Response:
  - A response code that is not 2xx represents the email already exists.
  - If valid, the api will respond with the following JSON object.

  ```json
  {
      "id": "unique user id specified by the api"
  }
  ```

### Login (`POST` - `/login`)

- Payload:
  Post a JSON payload to the endpoint with the following:

  ```json
  {
      "username": "username",
      "password": "password"
  }
  ```

- Response:

  - A response code that is not 2xx represents a failed password or non-existent username.
  - If valid, the api will respond with the following JSON object.

  The token will expire in 100 hours

  ```json
  {
      "id": "unique user id specified by the api",
      "accessToken": "a random JWT",
      "refreshToken": "another random JWT"
  }
  ```

### Get User (`GET` - `/query/user/{userid}`)

- Request Header:
  
  ```header
  Authorization: JWT returned from /login
  ```

- Response:
  
  - A response code that is not 2xx represents an invalid JWT, or if the JWT is not of the user `userid`
  - If valid, the api will respond with the following JSON object.

  ```json
  {
      "username": "username of the user",
      "packs": [
          {
              "id": "id of the pack",
              "name": "display name of the pack"
          },
          {
              "id": "id of the pack",
              "name": "display name of the pack"
          }
      ]
  }
  ```

## Emoji Pack API

### Create Pack (`POST` - `/pack/create`)

- Request Header:
  
  ```header
  Authorization: JWT returned from /login
  ```

- Payload:
  Post a JSON payload to the endpoint with the following:

  ```json
  {
      "name": "Display name of the pack",
      "userid": "id of the user"
  }
  ```

- Response:
  - The api will respond with a JSON object with the pack's id.
  - A response code that is not 2xx represents the JWT is invalid.
  - The server will also respond with a code that is not 2xx if the JWT is not of the user
  - The server will also respond with a code that is not 2xx if the created pack will exceed `MAX_PACK_COUNT`

  ```json
  {
      "id": "unique pack specified by the api"
  }
  ```

### Get Pack (`GET` - `/pack/{packid}`)

- Request Header:
  
  ```header
  Authorization: JWT returned from /login
  ```

- Response:
  
  - A response code that is not 2xx represents the JWT is invalid.
  - The server will also return a code that is not 2xx if the pack requested does not exist, or if the pack is private and the user does not own the pack
  - If successful, the api will respond with this JSON object.

  ```json
  {
      "id": "unique pack specified by the api",
      "name": "name of the pack",
      "visibility": "true/false if the pack is visible or not",
      "emojis": [
          {
              "id": "id of the emoji",
              "name": "display name of the emoji",
              "count": "number of times the emoji was copied"
          }
      ]
  }
  ```

  - The API should return the emojis in the order of `count`, and use the emoji name as a tie-breaker.

### Edit Pack (`PATCH` - `/pack/edit`)

- Request Header:
  
  ```header
  Authorization: JWT returned from /login
  ```

- Payload:
  Send a JSON payload to the endpoint with the following:

  ```json
  {
      "id": "the id of the pack - REQUIRED",
      "newName": "The new name of the pack - OPTIONAL",
      "newVisibility": "Change visibility (true/false) - OPTIONAL"
  }
  ```

- Response:
  A response code that is not 2xx represents the JWT is invalid, or if the pack does not exist, or if the pack does not belong to the user.

### Delete Pack (`DELETE` - `/pack/delete/{packid}`)

- Request Header:
  
  ```header
  Authorization: JWT returned from /login
  ```

- Response:
  - A response code that is not 2xx represents the JWT is invalid, or if the pack does not exist, or if the pack does not belong to the user.
  - The server must delete all emojis associated with the pack, and all the resources linked to it

### Clone Pack (`POST` - `/pack/clone`)

- Request Header:
  
  ```header
  Authorization: JWT returned from /login
  ```

- Payload:
  Send a JSON payload to the endpoint with the following:

  ```json
  {
      "srcId": "the source id of the pack",
      "name": "The name of the cloned pack",
  }
  ```

- **ATTENTION**:
  When cloning packs, the pack id MUST be re-generated, as with all emoji ids, and the owner must be set to the caller
- Response:
  - A response code that is not 2xx represents the JWT is invalid, or if the source pack does not exist, or if the source pack is not public or does not belong to the user.
  - The server will also respond with a code that is not 2xx if the created pack will exceed `MAX_PACK_COUNT`
  - If the request is successful, a JSON object will be returned
  
  ```json
  {
      "id": "cloned pack id"
  }
  ```

## Emoji API

### Upload Emoji (`POST` - `/pack/upload/{packid}`)

- Request Header:
  
  ```header
  Authorization: JWT returned from /login
  ```

- Payload:
  The api will accept a `multipart/form-data` encoded post request. There will be an array of `files`, along with their file names, size and file content.

  - The API should reject any files that are larger than 256kb.
  - The API should reject the **entire** request if the `packid` does not belong to the owner
  - The API should also ignore any files that are not PNG
  - If the length of the array + the current size of the pack exceeds `MAX_PACK_SIZE`, the server should reject the **entire** request.
  - If the array length exceeds `MAX_PACK_SIZE`, the server should reject the **entire** request.
  - The API should reject any file with the same **file name** (excluding extension) as any emoji already existing in the pack
  
  See: <https://github.com/expressjs/multer> for how to parse this data.

- Response:
  The api will return a JSON list of images that have been rejected.

  ```json
  ["file.png", "malware.exe"]
  ```

  A response code that is not 2xx represents an invalid Authorization Header.

  If no files are rejected, this list should be empty.

- Server Actions:
  
  After the emojis are uploaded, their associated Ids should also be synced up with the ids stored in the pack.

### Edit Emoji (`PATCH` - `/emoji/edit`)

- Request Header:
  
  ```header
  Authorization: JWT returned from /login
  ```

- Payload:
  Send a JSON payload to the endpoint with the following:

  ```json
  {
      "id": "the id of the emoji - REQUIRED",
      "newName": "The new name of the emoji - OPTIONAL",
      "newPack": "the id of the new pack - OPTIONAL"
  }
  ```

- Response:
  - A response code that is not 2xx represents the JWT is invalid, or if the emoji does not exist, or if the emoji does not belong to the user.
  - If a new pack is specified, the pack MUST be owned by the user

### Delete Emoji (`DELETE` - `/emoji/delete/{emojiId}`)

- Request Header:
  
  ```header
  Authorization: JWT returned from /login
  ```

- Response:
  - A response code that is not 2xx represents the JWT is invalid, or if the emoji does not exist, or if the emoji does not belong to the user.
  - The server must remove the emoji from the pack it is associated with, and delete the emoji.

### Clone Emoji (`POST` - `/emoji/clone`)

- Request Header:
  
  ```header
  Authorization: JWT returned from /login
  ```

- Payload:
  Send a JSON payload to the endpoint with the following:

  ```json
  {
      "srcId": "the source id of the emoji",
      "destPackId": "The destination pack id",
  }
  ```

- **ATTENTION**:
  When cloning emojis, the emoji id MUST be re-generated, and the owner must be set to the caller
- Response:
  - A response code that is not 2xx represents the JWT is invalid, or if the source emoji does not exist, or if the source emoji is not public or does not belong to the user.
  - The server will also reject the request if the copied emoji will exceed `MAX_PACK_SIZE`
  - The server will also reject the request if the pack already contains an emoji with the same name as the copied emoji (excluding file extension)
  - If the request is successful, a JSON object will be returned
  
  ```json
  {
      "id": "cloned emoji id"
  }
  ```

### Get Emoji (`GET` - `/emoji/{emojiid}`)

- Request Header:
  
  ```header
  Authorization: JWT returned from /login
  ```

- Response:
  
  - A response code that is not 2xx represents the JWT is invalid.
  - The server will also return a code that is not 2xx if the emoji requested does not exist, or if the pack is private and the user does not own the pack
  - If successful, the api will respond with this JSON object.

  ```json
  {
      "id": "unique emoji specified by the api",
      "name": "display name of the emoji",
      "count": "number of times the emoji was copied",
      "packid": "the id of the pack",
      "ownerid": "the id of the owner"
  }
  ```

### Load Emoji (`GET` - `/emoji/load/{emojiid}`)

- Request Header:
  
  ```header
  Authorization: JWT returned from /login
  ```

- Response:
  
  - A response code that is not 2xx represents the JWT is invalid.
  - The server will also return a code that is not 2xx if the emoji requested does not exist, or if the pack is private and the user does not own the pack
  - If successful, the api will respond will response with a file download of either type `image/png` or `image/jpeg`.

## Query API

### Query Pack Emojis (`POST` - `/query/pack/{packid}`)

- Request Header:
  
  ```header
  Authorization: JWT returned from /login
  ```

- Payload:
  Post a JSON payload to the endpoint with the following:

  ```json
  {
      "query": "The query string",
  }
  ```

- Querying:
  
  This api will search all the emojis within the pack, and return matching results.

  The api will return emojis that:
  - contain the query string in the emoji name (case insensitive)
  - ordered by the number of copies

- Response:
  
  - A response code that is not 2xx represents an invalid JWT, or if the pack is private and the user is not the owner of the pack.
  - If valid, the api will respond with the following JSON object.

  ```json
    [
        {
            "id": "id of the emoji",
            "name": "display name of the emoji",
            "count": "number of times the emoji was copied"
        },
        {
            "id": "id of the emoji",
            "name": "display name of the emoji",
            "count": "number of times the emoji was copied"
        }
    ]
  ```

### Query Packs (`POST` - `/query/global/packs`)

- Request Header:
  
  ```header
  Authorization: JWT returned from /login
  ```

- Payload:
  Post a JSON payload to the endpoint with the following:

  ```json
  {
      "query": "The query string",
  }
  ```

- Querying:
  
  This api will search all public packs

  The api will return packs that:
  - contain the query string in the pack name (case insensitive)
  - ordered by the number of copies (sum of all the emojis inside the pack)

- Response:
  
  - A response code that is not 2xx represents an invalid JWT, or if JWT does not belong to the user `userid`.
  - If valid, the api will respond with the following JSON object.
  - The Json should include exactly 6 of the top emojis for each pack (if there are less than six, return as many as possible)
  - No more than 100 packs should be returned by the api, (cut the rest off)
  
  ```json
    [
        {
            "id": "id of the pack",
            "name": "display name of the pack",
            "count": "number of times the pack was copied (sum of all its emojis)",
            "preview": [
              {
                "name": "name of the emoji",
                "id": "id of the emoji"
              },
              {
                "name": "name of the emoji",
                "id": "id of the emoji"
              },
              {
                "name": "name of the emoji",
                "id": "id of the emoji"
              },
              {
                "name": "name of the emoji",
                "id": "id of the emoji"
              },
              {
                "name": "name of the emoji",
                "id": "id of the emoji"
              },
              {
                "name": "name of the emoji",
                "id": "id of the emoji"
              }
            ]
        }
    ]
  ```

### Query Global Emojis (`POST` - `/query/global`)

- Request Header:
  
  ```header
  Authorization: JWT returned from /login
  ```

- Payload:
  Post a JSON payload to the endpoint with the following:

  ```json
  {
      "query": "The query string",
  }
  ```

- Querying:
  
  This api will search all public packs, and return matching results.

  The api will return emojis that:
  - contain the query string in the emoji name (case insensitive)
  - ordered by the number of copies

- Response:
  
  - A response code that is not 2xx represents an invalid JWT.
  - If valid, the api will respond with the following JSON object.
  - No more than 500 emojis should be returned by the api, (cut the rest off)

  ```json
    [
        {
            "id": "id of the emoji",
            "name": "display name of the emoji",
            "count": "number of times the emoji was copied",
            "packId": "the id of the pack"
        }
    ]
  ```

### Query Top Emojis (`POST` - `/query/top`)

- Request Header:
  
  ```header
  Authorization: JWT returned from /login
  ```

- Querying:
  
  This api will search all emojis, and return the top 100 most copied emojis.


- Response:
  - A response code that is not 2xx represents an invalid JWT.
  - If valid, the api will respond with the following JSON object.
  - No more than 100 emojis should be returned by the api, (cut the rest off)

  ```json
    [
        {
            "id": "id of the emoji",
            "name": "display name of the emoji",
            "count": "number of times the emoji was copied",
            "packId": "the id of the pack"
        }
    ]
  ```
