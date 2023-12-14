# Self Hosting (Railway)

Here are the steps to get a Railway instance of the dialoqbase server up and running.

:::warning
Dialoqbase use nice amount of memory. So, make sure you add credit limit to your Railway account.
:::


## Prerequisites

- [Railway](https://railway.app/)
- [OpenAI API Key](https://platform.openai.com/account/api-keys)
- [Supabase Database](https://supabase.com/)

## Steps

Follow the steps below to get a Railway instance of the dialoqbase server up and running.

### One Click Deploy

Just click on the button below to deploy the template on Railway.

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/TXdjD7?referralCode=olbszX)

You need to provide the following environment variables:

- `OPENAI_API_KEY`
- `DATABASE_URL`


You can skip the rest of the steps by watching the video below.

<video src="https://video.twimg.com/ext_tw_video/1668206930240864256/pu/vid/1354x720/vL4jyYEHTANSaxpF.mp4" controls="controls" style="width: 100%;"></video>

### Setting up a Supabase Database

Login to your Supabase account and follow the steps below to setup the database.

#### 1. Create a new project

Click on the `New Project` button to create a new project. and wait for the project to be created.

<div class="tip custom-block" style="padding-top: 8px">
You need to remember the password you provide to the project 😁.
</div>


#### 2. Copy the URL

Once the project is created, next step is to get the database URL.

1. Click on the cog icon on the left sidebar.

2. Click on the `Database`  from project settings sidebar.

3. Scroll down to the `Connection String` section and select the `Node.js` tab.

4. Copy the `DATABASE_URL` and replace `[YOUR-PASSWORD]` with the password you provided to the project.

5. Paste the `DATABASE_URL` in the railway environment variables. 



That's it! You have successfully setup the database.


### Setting up the OpenAI API Key

Just copy paste your `OPENAI_API_KEY` in the railway environment variables.


### Launch the server

After setting up the database and the OpenAI API Key, you can now launch the server by clicking `Deploy` button. This may take a few minutes to deploy the server be patient.