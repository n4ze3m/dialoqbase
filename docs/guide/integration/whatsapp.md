# Whatsapp (experimental)

WhatsApp is a popular messaging app that is used by over 1.5 billion people in over 180 countries. It is owned by Facebook and is the most popular messaging app in the world. It is also the most popular messaging app in India, with over 400 million users.


> **Note:** This feature is currently in expiremental. If you encounter any issues, please report them to us on our [GitHub](https://github.com/n4ze3m/dialoqbase/issues/new)


## Prerequisites

- A Meta app - Create one by following steps 1-2 of [this guide](https://developers.facebook.com/docs/whatsapp/cloud-api/get-started)

- A WhatsApp Business Account connected to your Meta app


## Enable WhatsApp Channel on dialoqbase


To enable the WhatsApp channel, you need to provide the following information to dialoqbase:


1. Go to bot integration page and click on the `WhatsApp` button. You will be asked to provide the following information:

    - *Phone Number ID*: In your Meta app's WhatsApp Getting Started page, copy the Phone Number ID and paste it here.
    - *Verify Token*: Generate a random alphanumeric string to verify webhook requests are from Meta.
    - *Webhook URL*: Copy the Webhook URL from dialoqbase and paste it in the Webhook URL field in your Meta app's WhatsApp Getting Started page.
    - *Access Token*: If you have permanent access token, you can paste it here. Otherwise, paste your 24-hour access token here.

2. Click on the `Save` button to save your changes.


that's it! You have successfully enabled the WhatsApp channel for your bot. You can now interact with your bot through WhatsApp.


## Configuring Webhooks


this is important to configure webhooks in your Meta app's WhatsApp Webhooks page. 


- Subscribe to the `messages` webhook in your Meta app dashboard to enable messaging.




## Issues

Currently there is few issues with WhatsApp channel. We are working on it and will fix it soon. If you encounter any issues, please report them to us on our [GitHub](https://github.com/n4ze3m/dialoqbase/issues/new)


## Security


We currently don't verify the signature of the incoming requests. We will add this feature soon. If you have a simpe solution for this, please let us know on our [GitHub](https://github.com/n4ze3m/dialoqbase/issues/new)