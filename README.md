# Portfolio

Bits and pieces of the [Craft Delivery](https://craftdelivery) stack

### React Native Helper

I came up with this helper while developing the driver `dispatcher` app

[Expo.js apps using a localhost backend over ngrok](https://dev.to/craftdelivery/expo-js-apps-using-a-localhost-backend-over-ngrok-hb6)

### React Native Dispatch App

`dispatcher` folder is very much a work in progress

This project was a chance to try out [redux-toolkit](https://github.com/reduxjs/redux-toolkit)
  - State is kept in slices instead of combining reducers
  - Uses [Immer](https://github.com/immerjs/immer)
    - no need to use destructuring or worry about mutating state 

The main purpose of this app at the moment is to track driver position for use in an Uber style delivery map

TODO features:
  - log location to DynamoDB instead of pg
    - websocket implementation is in Lambda/DynamoDB/CloudFront
      - have managed to get this example running in AWS 
        - [API Gateway WebSocket APIs Serverless](https://blog.neverendingqs.com/2019/07/01/serverless-websocket-example.html)
      - no worrying about scaling or memory constraints
    - we don't want to connect to pg from here if we can avoid it
  - dispatch override
    - a human may decide to route orders manually
  - image uploading
  - order checklist
  - order modification
  - canned messages to customer
    - broadcast or targeted
  - order history / queue
  - pay history
  - admin chat

## Lambda
These projects are kept as separate git repos in AWS Code Commit. The main Craft Delivery ExpressJS app calls these functions using `axios`

### Rationale
The Craft Delivery ExpressJS app was getting too big to manage with so many dependencies. I decided to spin out some of the bigger chunks to AWS Lambda

AWS and Twilio are huge dependencies and its nice to have these separate from the ExpressJS app

The Stripe library is still needed to sign incoming webhooks

### No Database connection
Charger, Mailer and Texter do not connect to the postgres database. This is done for security purposes as well as to minimize open connections. Database relevant feedback is provided via webhook

### Webhook init

See [index-express.js](https://github.com/craftdelivery/portfolio/blob/main/index-express.js) for how the express app handles incoming webhooks

### Projects
`express-js` folders contain support code from the ExpressJS monolith
  - Charger: Serverless Stripe handling
    - Express Webhook Handling:
      - Incoming payload must be signed
        - `verifysig.js`
      - We write the incoming response to a table
        - this is then picked up later by via pg-notify
          - event type determines which handler deals the the payload
        - `events.js`: a list of supported events
        - see [index-express.js](https://github.com/craftdelivery/portfolio/blob/main/index-express.js) for pg-notify setup
          - see [sql/notify_stripe.sql](https://github.com/craftdelivery/portfolio/blob/main/charger/sql/notify_stripe.sql)
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