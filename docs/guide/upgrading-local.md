#  Upgrading (local)

This documentation will guide you through the process of updating your dialoqbase Docker container to the latest version using just three commands.


## Step 1: Stop the Existing Container


1. Open a terminal or command prompt on your system.

2. Navigate to the directory where your dialoqbase Docker container is running.

3. Run the following command to stop the existing container:

:::code-group
```sh [docker-compose]
docker-compose down
```

```sh [docker compose]
docker compose down
```
:::

This command will gracefully stop the running container.


## Step 2: Pull the Latest Image

1. In the same terminal or command prompt, run the following command to pull the latest version of dialoqbase from the Docker registry:

:::code-group
```sh [docker-compose]
docker-compose pull
```

```sh [docker compose]
docker compose pull
```
:::

Docker will retrieve the latest version of the dialoqbase image from the registry.

## Step 3: Bring Up the Updated Container

1. Once the latest version has been pulled, you can bring up the updated container using the following command:

:::code-group
```sh [docker-compose]
docker-compose up -d
```

```sh [docker compose]
docker compose up -d
```
:::

This command will start the updated container in the background, and you can continue using dialoqbase as usual.


## Step 4: Verify the Update (Optional)

1. To verify that the update was successful, run the following command:

:::code-group
```sh [docker-compose]
docker-compose logs -f
```
```sh [docker compose]
docker compose logs -f
```
:::


Congratulations! You have successfully updated your Dialoqbase Docker container to the latest version.

## Additional Notes


- Ensure that you have appropriate permissions to stop and start Docker containers.

- If you encounter any issues during the update process, refer to the Docker documentation or dialoqbase discord server for help.

- It is recommended to take a backup of your existing container or any critical data before updating to a new version.

- Be aware that updating to a new version may introduce changes and improvements, which might require you to update your configuration or adapt your code accordingly. Please refer to the release notes for more information about the changes in each version.