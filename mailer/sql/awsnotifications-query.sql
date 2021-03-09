select subject,
        message_type,
        notification_type
  from  sometable 
where notification_type='Delivery' -- Bounce or Complaint


                    subject                     |  message_type   | notification_type 
------------------------------------------------+-----------------+-------------------
 Please confirm your email address [3118]       | reg             | Delivery
 Session Login: invalid token                   | admin-json      | Delivery
 SMS localhost link                             | admin-json      | Delivery
 Outgoing SMS Webhook                           | admin-json      | Delivery
 SMS HOOK: SM6933f4cbd3d542e3af6ea2ae32208e6f   | admin-json      | Delivery
 Admin Router Handler Error                     | admin-json      | Delivery
 Invalid Password                               | admin-json      | Delivery
 Invalid Password                               | admin-json      | Delivery
 Outgoing SMS Webhook                           | admin-json      | Delivery
 New Order (#2)                                 | checkout-notify | Delivery
 Stripe Checkout Response                       | admin-json      | Delivery
 Your Craft Delivery order (#8) has been placed | checkout-notify | Delivery
 Welcome to Craft Delivery                      | signup-new      | Delivery
