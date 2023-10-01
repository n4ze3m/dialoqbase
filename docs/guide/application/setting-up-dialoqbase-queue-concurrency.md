# Setting Dialoqbase Queue Processing Concurrency

In Dialoqbase, you have the option to configure the concurrency level for queue processing. Queue processing concurrency determines how many tasks or jobs can be processed simultaneously, which can significantly impact the efficiency and performance of your application. By adjusting this value, you can fine-tune your application to meet your specific requirements.

## Prerequisites

- Basic knowledge of environment variables and application configuration.

## Default Concurrency Setting

By default, Dialoqbase sets the queue processing concurrency to `1`. This means that tasks in the queue are processed one at a time in a sequential manner. While this setting ensures stability, it may not be optimal for applications with high volumes of tasks or jobs to process.

## Modifying the Concurrency Setting

To adjust the queue processing concurrency in Dialoqbase, you will need to set an environment variable named `DB_QUEUE_CONCURRENCY` to your desired value. Follow these steps:

1. **Access Your Environment Variables**: Go to Dialoqbase folder and open the `.env` file in a text editor.

2. **Set `DB_QUEUE_CONCURRENCY`**: Create or edit the environment variable `DB_QUEUE_CONCURRENCY` and assign it the desired concurrency value. For example, to set a concurrency of 5, you would add or modify the variable as follows:

   ```shell
   DB_QUEUE_CONCURRENCY=5
   ```

   Ensure that you choose a value that suits your application's requirements. Higher values allow for more concurrent processing, which can improve performance but may also increase resource consumption.

3. **Save and Apply Changes**: After setting the environment variable, save your changes and restart your Dialoqbase application to apply the new concurrency setting. The exact process for restarting the application will depend on your deployment environment.

## Considerations

When adjusting the queue processing concurrency, keep the following considerations in mind:

- **Resource Usage**: Higher concurrency levels may require more system resources (CPU and memory), so ensure that your server can handle the increased load.