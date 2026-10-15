   import 'dotenv/config';
   import app from './app.js';
   import prisma from './config/prisma.js';

   const PORT = process.env.PORT || 3000;

   async function start() {
     try {
       // Fail fast: confirm the DB is reachable before accepting traffic.
       await prisma.$connect();
       console.log('Connected to PostgreSQL via Prisma');

       app.listen(PORT, () => {
         console.log(`Server is live on http://localhost:${PORT}`);
       });
     } catch (err) {
       console.error('Failed to connect to the database:', err.message);
       process.exit(1);
     }
   }

   start();