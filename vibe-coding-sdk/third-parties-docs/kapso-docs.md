https://docs.kapso.ai/docs/platform/webhooks/overview ---- ---- ---- ---- ---- ---- ---- ---- ---- 



# Webhooks overview

> Get real-time notifications for WhatsApp events

Kapso uses webhooks to push real-time notifications about your WhatsApp messages and conversations. All webhooks use HTTPS and deliver a JSON payload you can use in your application.

## What are webhooks?

Webhooks notify your application when events occur. You can use them to:

* Send automated replies when customers message you
* Update conversation status in your CRM
* Track message delivery and read receipts
* Trigger alerts when conversations go inactive
* Store events in your database for analytics

## Steps to receive webhooks

1. Create an endpoint to receive requests
2. Register your webhook
3. Verify signatures
4. Test your endpoint

## 1. Create an endpoint

Create a route in your application that accepts POST requests.

```javascript  theme={null}
app.post('/webhooks/whatsapp', async (req, res) => {
  const { event, data } = req.body;

  console.log('Event:', event);
  console.log('Data:', data);

  // Return 200 to acknowledge receipt
  res.status(200).send('OK');
});
```

Your endpoint must return `200 OK` within 10 seconds.

## 2. Register your webhook

Kapso supports two types of webhooks:

### Project webhooks

Project-wide events like when customers connect WhatsApp.

**Setup:**

1. Open sidebar → **Webhooks**
2. Go to **Project webhooks** tab
3. Click **Add Webhook**
4. Enter your HTTPS endpoint URL
5. Copy the auto-generated secret key
6. Subscribe to events

### WhatsApp webhooks

Message and conversation events for specific WhatsApp numbers.

**Create via API:**

```javascript  theme={null}
await fetch('https://api.kapso.ai/platform/v1/whatsapp_webhooks', {
  method: 'POST',
  headers: {
    'X-API-Key': 'YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    whatsapp_webhook: {
      whatsapp_config_id: 'config-123',
      url: 'https://your-app.com/webhooks/whatsapp',
      events: ['whatsapp.message.received'],
      secret_key: 'your-secret-key'
    }
  })
});
```

## 3. Verify signatures

Always verify webhook signatures to ensure requests come from Kapso.

```javascript  theme={null}
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

app.post('/webhooks/whatsapp', (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  const isValid = verifyWebhook(req.body, signature, process.env.WEBHOOK_SECRET);

  if (!isValid) {
    return res.status(401).send('Invalid signature');
  }

  // Process webhook
  res.status(200).send('OK');
});
```

See [Security](/docs/platform/webhooks/security) for detailed verification guide.

## 4. Test your endpoint

Use ngrok or Cloudflare tunnel for local testing:

```bash  theme={null}
# Option 1: ngrok
ngrok http 3000

# Option 2: Cloudflare tunnel
brew install cloudflared
cloudflared tunnel --url http://localhost:3000
```

Register the generated HTTPS URL in your webhook configuration.

## Webhook headers

All webhooks include these headers:

```
X-Webhook-Event: whatsapp.message.received
X-Webhook-Signature: <hmac-sha256-hex>
X-Idempotency-Key: <unique-uuid>
X-Webhook-Payload-Version: v2
Content-Type: application/json
```

Batched webhooks also include:

```
X-Webhook-Batch: true
X-Batch-Size: 2
```

## FAQ

<AccordionGroup>
  <Accordion title="What is the retry schedule?">
    If Kapso doesn't receive a 200 response, webhooks are retried automatically:

    * 10 seconds
    * 40 seconds
    * 90 seconds

    Total time: \~2.5 minutes. After max retries, batched messages fall back to individual delivery.

    See [Advanced](/docs/platform/webhooks/advanced) for details.
  </Accordion>

  <Accordion title="How do I handle duplicate events?">
    Use the `X-Idempotency-Key` header to track processed events:

    ```javascript  theme={null}
    const processedKeys = new Set();

    app.post('/webhooks', (req, res) => {
      const idempotencyKey = req.headers['x-idempotency-key'];

      if (processedKeys.has(idempotencyKey)) {
        return res.status(200).send('Already processed');
      }

      // Process event
      processedKeys.add(idempotencyKey);
      res.status(200).send('OK');
    });
    ```
  </Accordion>

  <Accordion title="What about v1 webhooks?">
    New webhooks default to v2. Existing v1 webhooks continue to work.

    See [Legacy webhooks](/docs/platform/webhooks/legacy) for migration guide.
  </Accordion>
</AccordionGroup>

## Next steps

* [Event types](/docs/platform/webhooks/event-types) - See all available events and payloads
* [Security](/docs/platform/webhooks/security) - Detailed signature verification guide
* [Advanced](/docs/platform/webhooks/advanced) - Message buffering, ordering, and retries


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: /llms.txt


---- ---- ---- ---- ---- ---- ---- ---- ---- https://docs.kapso.ai/docs/platform/webhooks/event-types

# Event types

> Available webhook events and their payloads

All webhook payloads use v2 format with `phone_number_id` at the top level.

## Payload structure

Webhook payloads separate message data from conversation data:

* **message.kapso** - Message-scoped only: direction, status, processing\_status, origin, has\_media, media helpers (media\_data, media\_url, message\_type\_data)
* **conversation** - Top-level identifiers (id, phone\_number, phone\_number\_id). Optional conversation.kapso contains summary metrics (counts, last-message metadata, timestamps)
* **phone\_number\_id** - Included at top level for routing

## Project webhook events

### whatsapp.phone\_number.created

Fires when a customer successfully connects their WhatsApp through a setup link.

See [Connection detection](/docs/platform/detecting-whatsapp-connection) for implementation guide.

**Payload**:

```json  theme={null}
{
  "phone_number_id": "123456789012345",
  "project": {
    "id": "990e8400-e29b-41d4-a716-446655440004"
  },
  "customer": {
    "id": "880e8400-e29b-41d4-a716-446655440003"
  }
}
```

## WhatsApp webhook events

<CardGroup cols={2}>
  <Card title="Message received" icon="message">
    `whatsapp.message.received`

    Fired when a new WhatsApp message is received from a customer. Supports message buffering for batch delivery.
  </Card>

  <Card title="Message sent" icon="paper-plane">
    `whatsapp.message.sent`

    Fired when a message is successfully sent to WhatsApp
  </Card>

  <Card title="Message delivered" icon="check">
    `whatsapp.message.delivered`

    Fired when a message is successfully delivered to the recipient's device
  </Card>

  <Card title="Message read" icon="eye">
    `whatsapp.message.read`

    Fired when the recipient reads your message
  </Card>

  <Card title="Message failed" icon="triangle-exclamation">
    `whatsapp.message.failed`

    Fired when a message fails to deliver
  </Card>

  <Card title="Conversation created" icon="comments">
    `whatsapp.conversation.created`

    Fired when a new WhatsApp conversation is initiated
  </Card>

  <Card title="Conversation ended" icon="clock">
    `whatsapp.conversation.ended`

    Fired when a WhatsApp conversation ends (agent action, manual closure, or 24-hour inactivity)
  </Card>

  <Card title="Conversation inactive" icon="timer">
    `whatsapp.conversation.inactive`

    Fired when no messages (inbound/outbound) for configured minutes (1-1440, default 60)
  </Card>
</CardGroup>

## Payload structures

### whatsapp.message.received

```json  theme={null}
{
  "message": {
    "id": "wamid.123",
    "timestamp": "1730092800",
    "type": "text",
    "text": { "body": "Hello" },
    "kapso": {
      "direction": "inbound",
      "status": "received",
      "processing_status": "pending",
      "origin": "cloud_api",
      "has_media": false
    }
  },
  "conversation": {
    "id": "conv_123",
    "phone_number": "+15551234567",
    "status": "active",
    "last_active_at": "2025-10-28T14:25:01Z",
    "created_at": "2025-10-28T13:40:00Z",
    "updated_at": "2025-10-28T14:25:01Z",
    "metadata": {},
    "phone_number_id": "123456789012345",
    "kapso": {
      "contact_name": "John Doe",
      "messages_count": 1,
      "last_message_id": "wamid.123",
      "last_message_type": "text",
      "last_message_timestamp": "2025-10-28T14:25:01Z",
      "last_message_text": "Hello",
      "last_inbound_at": "2025-10-28T14:25:01Z",
      "last_outbound_at": null
    }
  },
  "is_new_conversation": true,
  "phone_number_id": "123456789012345"
}
```

### whatsapp.message.sent

```json  theme={null}
{
  "message": {
    "id": "wamid.456",
    "timestamp": "1730092860",
    "type": "text",
    "text": { "body": "On my way" },
    "kapso": {
      "direction": "outbound",
      "status": "sent",
      "processing_status": "completed",
      "origin": "cloud_api",
      "has_media": false
    }
  },
  "conversation": {
    "id": "conv_123",
    "phone_number": "+15551234567",
    "status": "active",
    "last_active_at": "2025-10-28T14:31:00Z",
    "created_at": "2025-10-28T13:40:00Z",
    "updated_at": "2025-10-28T14:31:00Z",
    "metadata": {},
    "phone_number_id": "123456789012345",
    "kapso": {
      "contact_name": "John Doe",
      "messages_count": 2,
      "last_message_id": "wamid.456",
      "last_message_type": "text",
      "last_message_timestamp": "2025-10-28T14:31:00Z",
      "last_message_text": "On my way",
      "last_inbound_at": "2025-10-28T14:25:01Z",
      "last_outbound_at": "2025-10-28T14:31:00Z"
    }
  },
  "is_new_conversation": false,
  "phone_number_id": "123456789012345"
}
```

### whatsapp.message.delivered

```json  theme={null}
{
  "message": {
    "id": "wamid.456",
    "timestamp": "1730092888",
    "type": "text",
    "text": { "body": "On my way" },
    "kapso": {
      "direction": "outbound",
      "status": "delivered",
      "processing_status": "completed",
      "origin": "cloud_api",
      "has_media": false
    }
  },
  "conversation": {
    "id": "conv_123",
    "phone_number": "+15551234567",
    "status": "active",
    "last_active_at": "2025-10-28T14:31:28Z",
    "created_at": "2025-10-28T13:40:00Z",
    "updated_at": "2025-10-28T14:31:28Z",
    "metadata": {},
    "phone_number_id": "123456789012345"
  },
  "is_new_conversation": false,
  "phone_number_id": "123456789012345"
}
```

### whatsapp.message.failed

```json  theme={null}
{
  "message": {
    "id": "wamid.789",
    "timestamp": "1730093200",
    "type": "text",
    "text": { "body": "This message failed" },
    "kapso": {
      "direction": "outbound",
      "status": "failed",
      "processing_status": "completed",
      "origin": "cloud_api",
      "has_media": false
    }
  },
  "conversation": {
    "id": "conv_123",
    "phone_number": "+15551234567",
    "status": "active",
    "last_active_at": "2025-10-28T15:00:00Z",
    "created_at": "2025-10-28T13:40:00Z",
    "updated_at": "2025-10-28T15:00:00Z",
    "metadata": {},
    "phone_number_id": "123456789012345"
  },
  "is_new_conversation": false,
  "phone_number_id": "123456789012345"
}
```

### whatsapp.conversation.created

```json  theme={null}
{
  "conversation": {
    "id": "conv_789",
    "phone_number": "+15551234567",
    "status": "active",
    "last_active_at": "2025-10-28T14:00:00Z",
    "created_at": "2025-10-28T14:00:00Z",
    "updated_at": "2025-10-28T14:00:00Z",
    "metadata": {},
    "phone_number_id": "123456789012345",
    "kapso": {
      "contact_name": "John Doe",
      "messages_count": 0,
      "last_message_id": null,
      "last_message_type": null,
      "last_message_timestamp": null,
      "last_message_text": null,
      "last_inbound_at": null,
      "last_outbound_at": null
    }
  },
  "phone_number_id": "123456789012345"
}
```

### whatsapp.conversation.ended

```json  theme={null}
{
  "conversation": {
    "id": "conv_789",
    "phone_number": "+15551234567",
    "status": "ended",
    "last_active_at": "2025-10-28T15:10:45Z",
    "created_at": "2025-10-28T14:00:00Z",
    "updated_at": "2025-10-28T15:10:45Z",
    "metadata": {},
    "phone_number_id": "123456789012345",
    "kapso": {
      "contact_name": "John Doe",
      "messages_count": 15,
      "last_message_id": "wamid.999",
      "last_message_type": "text",
      "last_message_timestamp": "2025-10-28T15:10:45Z",
      "last_message_text": "Thanks!",
      "last_inbound_at": "2025-10-28T15:10:45Z",
      "last_outbound_at": "2025-10-28T15:10:30Z"
    }
  },
  "phone_number_id": "123456789012345"
}
```

### whatsapp.conversation.inactive

```json  theme={null}
{
  "conversation": {
    "id": "conv_789",
    "phone_number": "+15551234567",
    "status": "active",
    "last_active_at": "2025-10-28T13:00:00Z",
    "created_at": "2025-10-28T12:00:00Z",
    "updated_at": "2025-10-28T13:00:00Z",
    "metadata": {},
    "phone_number_id": "123456789012345"
  },
  "since_message": {
    "id": "msg_anchor",
    "whatsapp_message_id": "wamid.ANCHOR",
    "direction": "inbound",
    "created_at": "2025-10-28T13:00:00Z"
  },
  "inactivity": {
    "minutes": 60
  },
  "phone_number_id": "123456789012345"
}
```

## Message origin

The `message.kapso.origin` field indicates how the message entered the system:

* **cloud\_api** - Sent via Kapso API (outbound jobs, flow actions, API calls)
* **business\_app** - Echoed from WhatsApp Business App (when using the Business App)
* **history\_sync** - Backfilled during message history imports (only if project ran sync)

## Message types

The `message.type` field can be one of:

* `text` - Plain text message
* `image` - Image attachment
* `video` - Video attachment
* `audio` - Audio/voice message
* `document` - Document attachment
* `location` - Location sharing
* `template` - WhatsApp template message
* `interactive` - Interactive message (buttons, lists)
* `reaction` - Message reaction
* `contacts` - Contact card sharing

## Message type-specific data

### Media messages (image/video/document/audio)

```json  theme={null}
{
  "message": {
    "id": "wamid.789",
    "timestamp": "1730093000",
    "type": "image",
    "image": {
      "caption": "Photo description",
      "id": "media_id_123"
    },
    "kapso": {
      "direction": "inbound",
      "status": "received",
      "processing_status": "pending",
      "origin": "cloud_api",
      "has_media": true,
      "media_url": "https://api.kapso.ai/media/...",
      "media_data": {
        "url": "https://api.kapso.ai/media/...",
        "filename": "photo.jpg",
        "content_type": "image/jpeg",
        "byte_size": 204800
      },
      "message_type_data": {
        "caption": "Photo description"
      }
    }
  }
}
```

### Location messages

```json  theme={null}
{
  "message": {
    "type": "location",
    "location": {
      "latitude": 37.7749,
      "longitude": -122.4194,
      "name": "San Francisco",
      "address": "San Francisco, CA, USA"
    }
  }
}
```

### Template messages

```json  theme={null}
{
  "message": {
    "type": "template",
    "template": {
      "name": "order_confirmation",
      "language": {
        "code": "en_US"
      },
      "components": [...]
    }
  }
}
```

### Interactive messages

```json  theme={null}
{
  "message": {
    "type": "interactive",
    "interactive": {
      "type": "button_reply",
      "button_reply": {
        "id": "btn_1",
        "title": "Confirm"
      }
    }
  }
}
```

### Reaction messages

```json  theme={null}
{
  "message": {
    "type": "reaction",
    "reaction": {
      "message_id": "wamid.HBgNNTU0MTIzNDU2Nzg5MA",
      "emoji": "👍"
    }
  }
}
```


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: /llms.txt



-------------------------------------------https://docs.kapso.ai/docs/platform/webhooks/security


# Webhook security

> Verify webhook signatures to prevent unauthorized requests

Always verify webhook signatures to ensure requests come from Kapso.

## Signature verification

Kapso signs all webhooks with HMAC SHA256 using your webhook secret key. The signature is included in the `X-Webhook-Signature` header.

### How it works

1. Kapso creates a signature by hashing the raw JSON payload with your secret key
2. The signature is sent in the `X-Webhook-Signature` header
3. Your endpoint recreates the signature using the same method
4. Compare signatures using a timing-safe comparison

### Node.js example

```javascript  theme={null}
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

app.post('/webhooks/whatsapp', (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  const isValid = verifyWebhook(
    req.body,
    signature,
    process.env.WEBHOOK_SECRET
  );

  if (!isValid) {
    return res.status(401).send('Invalid signature');
  }

  // Process webhook
  console.log('Event:', req.body.event);
  res.status(200).send('OK');
});
```

### Python example

```python  theme={null}
import hmac
import hashlib
import json
from flask import Flask, request

app = Flask(__name__)

def verify_webhook(payload, signature, secret):
    expected_signature = hmac.new(
        secret.encode('utf-8'),
        json.dumps(payload).encode('utf-8'),
        hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(signature, expected_signature)

@app.route('/webhooks/whatsapp', methods=['POST'])
def webhook():
    signature = request.headers.get('X-Webhook-Signature')
    is_valid = verify_webhook(
        request.json,
        signature,
        os.environ['WEBHOOK_SECRET']
    )

    if not is_valid:
        return 'Invalid signature', 401

    # Process webhook
    print('Event:', request.json['event'])
    return 'OK', 200
```

### Ruby example

```ruby  theme={null}
require 'sinatra'
require 'json'
require 'openssl'

def verify_webhook(payload, signature, secret)
  expected_signature = OpenSSL::HMAC.hexdigest(
    'SHA256',
    secret,
    payload.to_json
  )

  Rack::Utils.secure_compare(signature, expected_signature)
end

post '/webhooks/whatsapp' do
  request.body.rewind
  payload = JSON.parse(request.body.read)
  signature = request.env['HTTP_X_WEBHOOK_SIGNATURE']

  unless verify_webhook(payload, signature, ENV['WEBHOOK_SECRET'])
    halt 401, 'Invalid signature'
  end

  # Process webhook
  puts "Event: #{payload['event']}"
  status 200
end
```

## Important notes

### Use the raw payload

Always verify against the raw JSON payload, not a parsed object:

```javascript  theme={null}
// ❌ Wrong - verifying parsed object
verifyWebhook(req.body, signature, secret)

// ✅ Correct - verifying raw string
const rawBody = JSON.stringify(req.body);
verifyWebhook(rawBody, signature, secret)
```

### Use timing-safe comparison

Never use `===` or `==` to compare signatures. Use timing-safe comparison to prevent timing attacks:

```javascript  theme={null}
// ❌ Wrong - vulnerable to timing attacks
if (signature === expectedSignature) { ... }

// ✅ Correct - timing-safe comparison
crypto.timingSafeEqual(
  Buffer.from(signature),
  Buffer.from(expectedSignature)
)
```

### Store secrets securely

* Never hardcode webhook secrets in your code
* Use environment variables or secret management services
* Rotate secrets periodically
* Use different secrets for development and production

## Idempotency

Webhooks may be delivered more than once. Use the `X-Idempotency-Key` header to track processed events.

### Simple in-memory tracking

```javascript  theme={null}
const processedKeys = new Set();

app.post('/webhooks', (req, res) => {
  const idempotencyKey = req.headers['x-idempotency-key'];

  if (processedKeys.has(idempotencyKey)) {
    return res.status(200).send('Already processed');
  }

  // Process event
  processEvent(req.body);

  processedKeys.add(idempotencyKey);
  res.status(200).send('OK');
});
```

### Database-backed tracking

```javascript  theme={null}
app.post('/webhooks', async (req, res) => {
  const idempotencyKey = req.headers['x-idempotency-key'];

  // Check if already processed
  const existing = await db.webhookEvents.findOne({
    idempotency_key: idempotencyKey
  });

  if (existing) {
    return res.status(200).send('Already processed');
  }

  // Process event
  await processEvent(req.body);

  // Store idempotency key
  await db.webhookEvents.create({
    idempotency_key: idempotencyKey,
    event: req.body.event,
    processed_at: new Date()
  });

  res.status(200).send('OK');
});
```

## Best practices

1. **Verify signatures first** - Before processing any webhook data
2. **Return 200 quickly** - Respond within 10 seconds to avoid retries
3. **Process asynchronously** - Use background jobs for heavy processing
4. **Handle duplicates** - Implement idempotency using `X-Idempotency-Key`
5. **Monitor failures** - Set up alerts for signature verification failures
6. **Use HTTPS only** - Never accept webhooks over HTTP
7. **Rotate secrets** - Change webhook secrets periodically
8. **Log everything** - Keep audit logs of webhook deliveries and failures


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: /llms.txt



------------------------------------https://docs.kapso.ai/docs/platform/webhooks/advanced



# Advanced features

> Message buffering, ordering, and retry policy

## Message buffering

Message buffering allows you to receive multiple `whatsapp.message.received` events in a single batched webhook, reducing load during high-volume conversations.

### How it works

1. **Debounce pattern** - Messages are collected until the configured time window expires
2. **Automatic batching** - Multiple messages from the same conversation are grouped
3. **Immediate delivery** - Batches are sent when max size is reached or window expires
4. **Per-conversation** - Each conversation has its own independent buffer

### Configuration

When creating or editing a webhook, enable message buffering for the `whatsapp.message.received` event:

* **Buffer window**: Time to wait before sending (1-60 seconds, default: 5)
* **Maximum batch size**: Max messages per batch (1-100, default: 50)

### Batched webhook format

```json  theme={null}
{
  "type": "whatsapp.message.received",
  "batch": true,
  "data": [
    {
      "message": {
        "id": "wamid.111",
        "timestamp": "1730092801",
        "type": "text",
        "text": { "body": "First in batch" },
        "kapso": {
          "direction": "inbound",
          "status": "received",
          "processing_status": "pending",
          "origin": "cloud_api",
          "phone_number": "+15551234567",
          "phone_number_id": "123456789012345"
        }
      },
      "conversation": {
        "id": "conv_123",
        "phone_number": "+15551234567",
        "status": "active",
        "last_active_at": "2025-10-28T14:26:01Z",
        "created_at": "2025-10-28T13:40:00Z",
        "updated_at": "2025-10-28T14:26:01Z",
        "metadata": {},
        "phone_number_id": "123456789012345"
      },
      "is_new_conversation": false,
      "phone_number_id": "123456789012345"
    },
    {
      "message": {
        "id": "wamid.112",
        "timestamp": "1730092802",
        "type": "text",
        "text": { "body": "Second in batch" },
        "kapso": {
          "direction": "inbound",
          "status": "received",
          "processing_status": "pending",
          "origin": "cloud_api",
          "phone_number": "+15551234567",
          "phone_number_id": "123456789012345"
        }
      },
      "conversation": {
        "id": "conv_123",
        "phone_number": "+15551234567",
        "status": "active",
        "last_active_at": "2025-10-28T14:26:02Z",
        "created_at": "2025-10-28T13:40:00Z",
        "updated_at": "2025-10-28T14:26:02Z",
        "metadata": {},
        "phone_number_id": "123456789012345"
      },
      "is_new_conversation": false,
      "phone_number_id": "123456789012345"
    }
  ],
  "batch_info": {
    "size": 2,
    "window_ms": 5000,
    "first_sequence": 101,
    "last_sequence": 102,
    "conversation_id": "conv_123"
  }
}
```

<Note>
  When buffering is enabled, ALL messages are delivered in batch format, even single messages. The `data` array will contain just one message if only one was received during the buffer window. Always check the `batch` field or `X-Webhook-Batch` header.
</Note>

### Handling batched webhooks

```javascript  theme={null}
app.post('/webhooks', (req, res) => {
  const isBatch = req.headers['x-webhook-batch'] === 'true';

  if (isBatch) {
    const { data, batch_info } = req.body;

    console.log(`Processing ${batch_info.size} messages`);

    data.forEach(event => {
      processMessage(event.message, event.conversation);
    });
  } else {
    // Single event
    const { message, conversation } = req.body;
    processMessage(message, conversation);
  }

  res.status(200).send('OK');
});
```

## Message ordering

Kapso ensures messages are delivered in the correct order within each conversation.

### How it works

* **Sequence-based ordering** - Each webhook delivery gets a sequence number
* **Automatic queuing** - Messages are queued if earlier messages haven't been delivered
* **Ordering timeout** - After 30 seconds, messages are delivered regardless to prevent delays
* **Per conversation** - Ordering is maintained independently per conversation
* **Applies to** - Message received and message sent events

This ensures your endpoint receives messages in the same order they were sent/received.

## Message origin

The `message.kapso.origin` field tells you how the message entered the system:

* **cloud\_api** - Sent via Kapso API (outbound jobs, flow actions, API calls)
* **business\_app** - Sent from WhatsApp Business App (manual messages your team sends using the Business App)
* **history\_sync** - Backfilled during message history import (only present if your project ran a sync)

Use this to filter out messages you don't want to process. For example, skip `business_app` messages to avoid processing manual messages sent by your team.

## Retry policy

If Kapso doesn't receive a 200 response, webhooks are automatically retried.

### Retry schedule

Each webhook is attempted based on this schedule:

* **Immediately** (initial attempt)
* **10 seconds** after first failure
* **40 seconds** after second failure
* **90 seconds** after third failure

**Total time to failure**: \~2.5 minutes across 3 retry attempts.

### What happens after retries fail?

After all retries are exhausted:

* The webhook is marked as failed
* Batched messages fall back to individual delivery
* You can check failed deliveries in the Kapso dashboard

### Handling retries in your code

Implement idempotency to handle retry attempts gracefully:

```javascript  theme={null}
app.post('/webhooks', async (req, res) => {
  const idempotencyKey = req.headers['x-idempotency-key'];

  // Check if already processed
  const existing = await db.webhookEvents.findOne({
    idempotency_key: idempotencyKey
  });

  if (existing) {
    // Already processed this webhook
    return res.status(200).send('Already processed');
  }

  try {
    // Process webhook
    await processEvent(req.body);

    // Store idempotency key
    await db.webhookEvents.create({
      idempotency_key: idempotencyKey,
      processed_at: new Date()
    });

    res.status(200).send('OK');
  } catch (error) {
    // Return 500 to trigger retry
    console.error('Webhook processing failed:', error);
    res.status(500).send('Processing failed');
  }
});
```

## Best practices

### Performance

1. **Respond quickly** - Return 200 within 10 seconds
2. **Process asynchronously** - Use background jobs for heavy processing
3. **Scale horizontally** - Use load balancers to handle high volume
4. **Enable buffering** - Reduce webhook volume during busy periods

### Reliability

1. **Implement idempotency** - Use `X-Idempotency-Key` to prevent duplicate processing
2. **Handle all event types** - Even if you don't need them now
3. **Log everything** - Track webhook deliveries and failures
4. **Set up monitoring** - Alert on high failure rates

### Example production setup

```javascript  theme={null}
const queue = require('bull'); // Background job processor
const webhookQueue = new queue('webhooks');

app.post('/webhooks', async (req, res) => {
  const idempotencyKey = req.headers['x-idempotency-key'];

  // Check if already processed
  if (await isProcessed(idempotencyKey)) {
    return res.status(200).send('Already processed');
  }

  // Add to background queue
  await webhookQueue.add({
    idempotency_key: idempotencyKey,
    event: req.body.event,
    data: req.body.data || req.body,
    headers: {
      signature: req.headers['x-webhook-signature'],
      batch: req.headers['x-webhook-batch']
    }
  });

  // Respond immediately
  res.status(200).send('OK');
});

// Process webhooks in background
webhookQueue.process(async (job) => {
  const { idempotency_key, event, data, headers } = job.data;

  // Verify signature
  if (!verifySignature(data, headers.signature)) {
    throw new Error('Invalid signature');
  }

  // Process event
  await processEvent(event, data);

  // Mark as processed
  await markProcessed(idempotency_key);
});
```

## Troubleshooting

<AccordionGroup>
  <Accordion title="Webhooks not being received">
    * Verify your endpoint is publicly accessible via HTTPS
    * Check firewall rules allow incoming requests from Kapso
    * Ensure you're returning 200 status within 10 seconds
    * Check webhook is enabled in dashboard
  </Accordion>

  <Accordion title="Duplicate webhooks">
    * Implement idempotency using `X-Idempotency-Key` header
    * Store processed keys in database or cache
    * Use timing-safe comparison when checking keys
  </Accordion>

  <Accordion title="Webhooks out of order">
    * Check sequence numbers in `batch_info`
    * Implement ordering logic in your application if needed
    * Note: 30-second timeout allows out-of-order delivery to prevent indefinite delays
  </Accordion>

  <Accordion title="High failure rate">
    * Verify signature verification logic is correct
    * Check endpoint response time (must be under 10 seconds)
    * Review error logs for exceptions in your code
    * Ensure database/external services aren't timing out
  </Accordion>
</AccordionGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: /llms.txt


---------------------------------------------https://docs.kapso.ai/docs/platform/broadcasts-api



# Broadcasts API

> Send template messages to multiple recipients programmatically

Send WhatsApp template messages to hundreds or thousands of recipients with full tracking and statistics.

<Info>
  **Example repo:** [github.com/gokapso/whatsapp-broadcasts-example](https://github.com/gokapso/whatsapp-broadcasts-example)
</Info>

## Complete workflow

```typescript  theme={null}
// Step 1: Create broadcast
const createResponse = await fetch('https://api.kapso.ai/platform/v1/whatsapp/broadcasts', {
  method: 'POST',
  headers: {
    'X-API-Key': 'your-api-key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    whatsapp_broadcast: {
      name: 'July promo',
      phone_number_id: '1234567890',
      whatsapp_template_id: '7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d'
    }
  })
});

const { data: broadcast } = await createResponse.json();
const broadcastId = broadcast.id;

// Step 2: Add recipients (repeat for batches > 1000)
await fetch(`https://api.kapso.ai/platform/v1/whatsapp/broadcasts/${broadcastId}/recipients`, {
  method: 'POST',
  headers: {
    'X-API-Key': 'your-api-key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    whatsapp_broadcast: {
      recipients: [
        {
          phone_number: '+14155550123',
          components: [
            {
              type: 'body',
              parameters: [
                { type: 'text', parameter_name: 'first_name', text: 'John' },
                { type: 'text', parameter_name: 'discount', text: '50%' }
              ]
            }
          ]
        }
      ]
    }
  })
});

// Step 3: Send broadcast
await fetch(`https://api.kapso.ai/platform/v1/whatsapp/broadcasts/${broadcastId}/send`, {
  method: 'POST',
  headers: { 'X-API-Key': 'your-api-key' }
});

// Step 4: Poll for progress
async function waitForCompletion(broadcastId) {
  while (true) {
    const statusResponse = await fetch(
      `https://api.kapso.ai/platform/v1/whatsapp/broadcasts/${broadcastId}`,
      { headers: { 'X-API-Key': 'your-api-key' } }
    );

    const { data } = await statusResponse.json();

    if (data.completed_at) {
      console.log(`Broadcast complete: ${data.sent_count}/${data.total_recipients} sent`);
      break;
    }

    console.log(`Progress: ${data.sent_count}/${data.total_recipients}`);
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5s
  }
}

await waitForCompletion(broadcastId);
```

***

## Step 1: Create broadcast

```typescript  theme={null}
const response = await fetch('https://api.kapso.ai/platform/v1/whatsapp/broadcasts', {
  method: 'POST',
  headers: {
    'X-API-Key': 'your-api-key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    whatsapp_broadcast: {
      name: 'July promo',
      phone_number_id: '1234567890',
      whatsapp_template_id: '7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d'
    }
  })
});

const { data } = await response.json();
// data.id = broadcast ID for next steps
// data.status = 'draft'
```

Requirements:

* Phone number must be production type (not sandbox)
* Template must be approved

## Step 2: Add recipients

Add up to 1,000 recipients per request. Repeat for batches over 1,000.

Recipients use Meta's component syntax to populate template variables.

### Body parameters

For templates with body text variables:

```typescript  theme={null}
await fetch(`https://api.kapso.ai/platform/v1/whatsapp/broadcasts/${broadcastId}/recipients`, {
  method: 'POST',
  headers: {
    'X-API-Key': 'your-api-key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    whatsapp_broadcast: {
      recipients: [
        {
          phone_number: '+14155550123',
          components: [
            {
              type: 'body',
              parameters: [
                { type: 'text', parameter_name: 'first_name', text: 'John' },
                { type: 'text', parameter_name: 'discount', text: '50%' }
              ]
            }
          ]
        },
        {
          phone_number: '+14155550124',
          components: [
            {
              type: 'body',
              parameters: [
                { type: 'text', parameter_name: 'first_name', text: 'Jane' },
                { type: 'text', parameter_name: 'discount', text: '40%' }
              ]
            }
          ]
        }
      ]
    }
  })
});
```

### Button parameters

For templates with dynamic button URLs:

```typescript  theme={null}
await fetch(`https://api.kapso.ai/platform/v1/whatsapp/broadcasts/${broadcastId}/recipients`, {
  method: 'POST',
  headers: {
    'X-API-Key': 'your-api-key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    whatsapp_broadcast: {
      recipients: [
        {
          phone_number: '+14155550123',
          components: [
            {
              type: 'body',
              parameters: [
                { type: 'text', parameter_name: 'first_name', text: 'Alicia' },
                { type: 'text', parameter_name: 'discount_code', text: 'JULY25' }
              ]
            },
            {
              type: 'button',
              sub_type: 'url',
              index: 0,
              parameters: [
                { type: 'text', text: 'promo-code-12345' }
              ]
            }
          ]
        }
      ]
    }
  })
});
```

### Media headers

For templates with image/video/document headers:

```typescript  theme={null}
await fetch(`https://api.kapso.ai/platform/v1/whatsapp/broadcasts/${broadcastId}/recipients`, {
  method: 'POST',
  headers: {
    'X-API-Key': 'your-api-key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    whatsapp_broadcast: {
      recipients: [
        {
          phone_number: '+14155550123',
          components: [
            {
              type: 'header',
              parameters: [
                {
                  type: 'image',
                  image: {
                    link: 'https://example.com/promo.jpg'
                  }
                }
              ]
            },
            {
              type: 'body',
              parameters: [
                { type: 'text', parameter_name: 'first_name', text: 'Alicia' },
                { type: 'text', parameter_name: 'discount_code', text: 'JULY25' }
              ]
            }
          ]
        }
      ]
    }
  })
});
```

### Response format

```json  theme={null}
{
  "data": {
    "added": 495,
    "duplicates": 5,
    "errors": [
      "Recipient 3: template parameters invalid - Template requires 2 parameters but 1 provided",
      "Recipient 7: invalid phone number format"
    ]
  }
}
```

## Step 3: Send broadcast

Trigger async send job:

```typescript  theme={null}
const response = await fetch(
  `https://api.kapso.ai/platform/v1/whatsapp/broadcasts/${broadcastId}/send`,
  {
    method: 'POST',
    headers: {
      'X-API-Key': 'your-api-key'
    }
  }
);

const { data } = await response.json();
// data.status = 'sending'
// data.started_at = timestamp
```

The broadcast processes asynchronously in the background. Poll for progress.

## Step 4: Track progress

```typescript  theme={null}
const response = await fetch(
  `https://api.kapso.ai/platform/v1/whatsapp/broadcasts/${broadcastId}`,
  {
    headers: {
      'X-API-Key': 'your-api-key'
    }
  }
);

const { data } = await response.json();
```

### Response metrics

```json  theme={null}
{
  "data": {
    "id": "5f6a7b8c-9d0e-1f2a-3b4c-5d6e7f8a9b0c",
    "name": "July promo",
    "status": "sending",
    "total_recipients": 1000,
    "sent_count": 650,
    "failed_count": 50,
    "delivered_count": 600,
    "read_count": 320,
    "responded_count": 45,
    "pending_count": 300,
    "response_rate": 6.9,
    "started_at": "2025-07-15T10:00:00Z",
    "completed_at": null
  }
}
```

### Status transitions

* `draft` → `sending` → `completed` or `failed`
* Poll every 5-10 seconds during send
* Check `completed_at` for completion

***

## Additional features

### List individual recipients

Get detailed per-recipient status:

```typescript  theme={null}
const response = await fetch(
  `https://api.kapso.ai/platform/v1/whatsapp/broadcasts/${broadcastId}/recipients?page=1&per_page=20`,
  {
    headers: {
      'X-API-Key': 'your-api-key'
    }
  }
);

const { data, meta } = await response.json();
```

### Recipient fields

```json  theme={null}
{
  "id": "8c9d0e1f-2a3b-4c5d-6e7f-8a9b0c1d2e3f",
  "phone_number": "14155550123",
  "status": "sent",
  "sent_at": "2025-07-15T10:05:23Z",
  "delivered_at": "2025-07-15T10:05:30Z",
  "read_at": "2025-07-15T10:12:45Z",
  "responded_at": "2025-07-15T10:15:00Z",
  "error_message": null,
  "template_components": [
    {
      "type": "body",
      "parameters": [
        { "type": "text", "parameter_name": "first_name", "text": "John" },
        { "type": "text", "parameter_name": "discount", "text": "50%" }
      ]
    }
  ]
}
```

### Batch processing (large campaigns)

For campaigns with 1,000+ recipients:

```typescript  theme={null}
// Split recipients into chunks of 1000
const chunkSize = 1000;
for (let i = 0; i < allRecipients.length; i += chunkSize) {
  const chunk = allRecipients.slice(i, i + chunkSize);

  await fetch(`https://api.kapso.ai/platform/v1/whatsapp/broadcasts/${broadcastId}/recipients`, {
    method: 'POST',
    headers: {
      'X-API-Key': 'your-api-key',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ whatsapp_broadcast: { recipients: chunk } })
  });

  // Optional: small delay between batches
  await new Promise(resolve => setTimeout(resolve, 100));
}
```


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: /llms.txt

