Set Up Environment Variables
Create a .env file in the root directory with the following variables:

plaintext

PORT=5000NODE_ENV=development
Create a .env file in the client directory with:

plaintext

VITE_API_URL=http://localhost:5000
4. Run the Application
Development Mode
To run the server in development mode:

bash
Run
npm run server
To run the client in development mode:

bash
Run
cd clientnpm run dev
Access the application at: http://localhost:3000 (or the port specified by Vite)

Production Mode
To build the client for production:

bash
Run
cd clientnpm run buildcd ..
To run the server in production mode (which will serve the built client files):

bash
Run
npm start
Access the application at: http://localhost:5000