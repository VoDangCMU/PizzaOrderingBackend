# Instruction

## First Run

- Create [.env](.env) file following [this](#env-structure) structure.  
- Run `yarn db:create` to create database.  
- Run `yarn migration:run` to run all migration.  
- Run `yarn dev` to start coding.

## Production Deployment
### Via Docker
#### Custom
Build image using command:
```bash
docker build -t <image_name> .
```
Replace `<image_name>` to your image tag, eg: `vd/backend`

Run container:
```bash
docker run -it -d --publish 7682:7682 <image_name>
```
#### Builtin
```bash
yarn build:docker
yarn start:docker
```
### Via pm2
Build application
```bash
yarn build
```
Run:
```bash
yarn pm2
```
## ENV Structure

```bash
DB_HOST=15.235.167.33
DB_PORT=5432
DB_USERNAME=internal
DB_PASSWORD=LOcF1ube8goCrR
DB_DATABASE=db
```