# Getting Started

This guide will help you get started with Dialoqbase API and its SDKs.

Currently, Dialoqbase supports the following SDKs:

- JavaScript

::: info
Documentation is not fully complete. We are working on it. If you need help, please contact us at Discord.
:::

## Prerequisites

Before you start using Dialoqbase, ensure you have the following:

- Dialoqbase application running on your machine or server.

- API Key to access the Dialoqbase API. (You can get the API key from the settings page of the Dialoqbase application)



## Installation


::: code-group
```sh [javascript]
npm install dialoqbase
```
:::


## Initialization

To start using the Dialoqbase API, you need to initialize the SDK with your API key.

::: code-group
```typescript [javascript]
import { createClient } from 'dialoqbase';

const dialoqbase = createClient(
    "http://localhost:3000",
    "YOUR_API_KEY"
)
```


- Replace `http://localhost:3000` with the URL of your Dialoqbase application.

- Replace `YOUR_API_KEY` with your Dialoqbase API key