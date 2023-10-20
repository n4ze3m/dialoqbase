# Support for Custom AI Models

## Introduction

Starting from version `1.2.0`, our platform provides support for local AI models which are compatible with the OpenAI API. A notable instance for such local AI deployment is the [LocalAI](https://github.com/go-skynet/LocalAI/) project.

This documentation will guide you through the steps needed to integrate a custom model deployed via LocalAI into our system.

## Prerequisites

1. Ensure you've already set up your local AI model using LocalAI or any other platform that offers OpenAI API compatibility.
2. Admin access to our platform is required to add new models.

## Integration Steps

### 1. Login as Administrator

Ensure that you're logged in with administrator rights to have the permissions necessary for this process.

### 2. Navigate to Model Settings

- Go to `Settings`.
- From the side menu, select `Models`.
- Click on `Add Models`.

### 3. Add Your Local or Custom Model URL

You'll be presented with a form asking for details about the model you wish to integrate:

- **URL**: Here, you need to provide the endpoint of your locally deployed AI model.
    - If you're using LocalAI and it's running on its default port (8080), you would enter `http://localhost:8080/v1`.
- **Model Selection**: Choose the model you want to use from your local AI instance.
- **Name**: Give your model a recognizable name.
  
Click `Save` to finalize adding your custom model.

## Conclusion

Once integrated, you can now utilize your custom model in the same way you'd use any other model in the platform. This allows for greater flexibility, especially when working in environments that may benefit from localized data processing, without the need to send data over the internet.