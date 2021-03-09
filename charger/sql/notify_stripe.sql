-- we can't send the full stripe payload as its too large
-- the handler will fetch the full payload
CREATE OR REPLACE FUNCTION notify_stripe()
  RETURNS trigger AS $BODY$
  DECLARE
    payload jsonb;
  BEGIN
    payload := json_build_object(
      'id', NEW.id,
      'chargeid', NEW.chargeid,
      'oid', NEW.oid,
      'event', NEW.event
    );
    PERFORM pg_notify('stripe-notification-event', payload::text);
    RETURN NULL;
  END;
$BODY$
LANGUAGE plpgsql VOLATILE;

-- create trigger for above function
CREATE TRIGGER notify_stripe
  AFTER INSERT
  ON "some_stripe_table"
  FOR EACH ROW
  EXECUTE PROCEDURE notify_stripe();