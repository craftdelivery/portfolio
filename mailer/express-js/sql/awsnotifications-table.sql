\d+ some_notifications_table
Table "public.some_table"
      Column       |            Type             |         Modifiers          
-------------------+-----------------------------+---------------------------
 message_id        | text                        | not null                   
 notification_type | awsnotificationtype         |                            
 timestamp         | timestamp without time zone | default CURRENT_TIMESTAMP  
 x_request_start   | timestamp without time zone |                            
 snstopic          | text                        |                            
 source            | text                        |                            
 destination       | text                        |                            
 subject           | text                        |                            
 message_type      | emailtype                   |                            
 hooktype          | text                        |                            
 raw               | jsonb                       |                            