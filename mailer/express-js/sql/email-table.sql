\d+ sometable

-- this is a logging table
-- we don't want foreign keys on message_id because the notifications table
-- may be purged from time to time, we wish to keep these in that case
 Table "public.sometable"
      Column  |            Type             |         Modifiers          
 destination  | text                        | not null                                            
 sender       | text                        | not null                                            
 body         | text                        | not null                                            
 subject      | text                        | not null                                            
 timestamp    | timestamp without time zone | default CURRENT_TIMESTAMP                           
 message_type | emailtype                   | default 'none'::emailtype                           
 id           | integer                     | not null default nextval('sometable_id_seq'::regclass) 
 message_id   | text                        |                                                     
 status       | integer                     |                                                     
Indexes:
    "sometable_pkey" PRIMARY KEY, btree (id)