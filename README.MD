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
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=
```