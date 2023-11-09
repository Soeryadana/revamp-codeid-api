## Description

Revamp Codeid is a NestJS application designed to manage bootcamp listing and bootcamp applications

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## API Endpoints

### Programs

1. Show List of Bootcamps
- Endpoint : `api/recamp-codeid/programs/`
- Params : orderBy, page, limit, search
- Method : GET
- Description : Retrieve a comprehensive list of available bootcamps, including essential details.

2. Show Details of a Specific Bootcamp
- Endpoint : `api/recamp-codeid/programs/view`
- Params : progEntityId
- Method : GET
- Description : Fetch detailed information about a specific bootcamp using its unique identifier. This includes curriculum, instructors, and any other pertinent details.

3. Apply to a Bootcamp
- Endpoint : `api/recamp-codeid/programs/apply-regular`
- Params : userEnitityId, progEntityId
- Body : user, education, files
- Method : POST
- Description : Submit an application to a specific bootcamp by providing necessary information.

4. Show Dashboard of Applied Bootcamps
- Endpoint : `api/recamp-codeid/programs/dasboard`
- Params : userEntityId
- Method : GET
- Description : Access a personalized dashboard displaying bootcamps to which the user has applied. This provides an overview of application status, updates, and any additional information related to the applied bootcamps.

### Users

1. Register an Account
- Endpoint : `api/recamp-codeid/users/signup`
- Method : POST
- Description : Register and account by giving the necessary information
  
2. Signin
- Endpoint : `api/recamp-codeid/users/signin`
- Method : POST
- Description : Sign in and retrieve a JWT as an identifier

2. Get Profile
- Endpoint : `api/recamp-codeid/users/profile`
- Method : GET
- Description : Retrieve a user profile

2. Get User
- Endpoint : `api/recamp-codeid/users/`
- Method : GET
- Description : Retrieve more detailed user data

## License

Nest is [MIT licensed](LICENSE).
