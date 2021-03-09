## Portfolio

### Overview
These projects are kept as separate git repos in AWS Code Commit

### Rationale
The Craft Delivery ExpressJS app was getting too big to manage with so many dependencies. I decided to spin out some of the bigger chunks to AWS Lambda

AWS, Twilio and Stripe are huge dependencies and its nice to have these separate from the ExpressJS app

Local Env variables have been replaced with `OMITTED`

### Projects
`express-js` folders contain support code from the ExpressJS monolith
  - Charger: Serverless Stripe handling
  - Mailer: Serverless Email Sender
  - Texter: Serverless Twilio SMS

### No Database connection
Charger, Mailer and Texter do not connect to the postgres database. This is done for security purposes as well as to minimize open connections. Database relevant feedback is provided via webhook


