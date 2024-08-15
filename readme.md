# App

## Steps

# in root folder

1. docker-compose up -d

# in project folder

1. npm install
2. ln -s ../.env .env
3. npx prisma migrate dev
4. npm start # for running the server
5. npm test # for running the tests

# disclaimer

I have commited .env file for the sake of simplicity, but in a real world scenario, it should be added to .gitignore and shared with the team in a secure way.
