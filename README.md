# Portfolio

## React Native

I came up with this helper while developing the driver `dispatch` app (WIP)

[Expo.js apps using a localhost backend over ngrok](https://dev.to/craftdelivery/expo-js-apps-using-a-localhost-backend-over-ngrok-hb6)

### Native Code

TODO: add dispatch folder

## Lambda
These projects are kept as separate git repos in AWS Code Commit

### Rationale
The Craft Delivery ExpressJS app was getting too big to manage with so many dependencies. I decided to spin out some of the bigger chunks to AWS Lambda

AWS, Twilio and Stripe are huge dependencies and its nice to have these separate from the ExpressJS app

Local Env variables have been replaced with `OMITTED`

### No Database connection
Charger, Mailer and Texter do not connect to the postgres database. This is done for security purposes as well as to minimize open connections. Database relevant feedback is provided via webhook

### Projects
`express-js` folders contain support code from the ExpressJS monolith
  - Charger: Serverless Stripe handling
  - Mailer: Serverless Email Sender
    - it accepts pre-formed HTML
    - next steps will be to move more code / dependencies to Lambda
    - express app send flow:
      - all emails are given an email type
        - we set ReturnPath to {emailType}@craftdelivery.ca
        - ReturnPath is returned in the webhook
          - pardon the dirty hack
        - This way we can categorize the aws notifications by email type
      - USER emails
        - generate html using `genmail.js`
          - depends on [npm mailgen](https://www.npmjs.com/package/mailgen)
        - depends on `mail.js`
      - ADMIN/DEV emails
        - generate json html email
          - DEV emails `adminjson.js`
          - PG errors `adminpgjson.js`
            - depends on [npm pg-error-constants](https://www.npmjs.com/package/pg-error-constants)
        - depends on `jsonemail.js`
          - depends on [npm json-markup](https://www.npmjs.com/package/json-markup)
      - send using sessend.js
        - calls lambda with preformed HTML
  - Texter: Serverless Twilio SMS



