Recipe Sharing Platform Server
Description
Server for a recipe sharing platform where users can manage accounts, follow others, and perform CRUD operations on recipes (cards) and comments. Users can like, comment, and rate recipes.

Features
User Management: CRUD operations on users, follow other users.
Recipe Management: CRUD on recipes/cards, like and rate them.
Comment Management: CRUD on comments.
Authentication: JWT-based authentication.

Installation
Clone the repository:
bash
Copy code
git clone <repository-url>
cd cardsserver
Install dependencies:
bash
Copy code
npm install
Create a .env file:
env
Copy code
ATLAS_CONNECTION_STRING=<your-mongo-connection-string>
JWT_SECRET=<your-secret>

Scripts
Start Production: npm start
Start Development: npm run dev

API Documentation
Users API: https://documenter.getpostman.com/view/37787169/2sAY4uCNd5
Cards API: https://documenter.getpostman.com/view/37787169/2sAY4uCNd5
Comments API: https://documenter.getpostman.com/view/37787169/2sAY4uCNd4

Dependencies
express: Fast, unopinionated, minimalist web framework for Node.js.
mongoose: Elegant MongoDB object modeling for Node.js.
jsonwebtoken: JSON Web Token implementation to authenticate users.
bcryptjs: Library to hash and compare passwords.
dotenv: Loads environment variables from a .env file.
cors: Middleware for enabling CORS in Express.
lodash: Utility library for JavaScript.
joi: Data validation library for JavaScript.
morgan: HTTP request logger middleware.
chalk: Terminal string styling library for enhancing console logs.
config: Node.js configuration library for managing app settings.
cross-env: Sets environment variables across platforms.
nodemon: Tool for automatically restarting the server during development.
