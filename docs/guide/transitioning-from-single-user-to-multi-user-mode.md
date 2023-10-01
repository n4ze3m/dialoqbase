# Transitioning from Single-User to Multi-User Mode with Dialoqbase

::: warning
If you're using `v1.0.0` or above, you can skip this guide. Multi-user mode is enabled by default in `v1.0.0`. This guide is only for `v0.0.32` and below.
:::

If you've been utilizing Dialoqbase from a single-user standpoint and are now eager to expand its capabilities to cater to multiple users, you've come to the right place. Dialoqbase, renowned for its user-friendliness and proficiency in constructing conversational interfaces, seamlessly accommodates multi-user environments. This guide will comprehensively walk you through the essential steps for transitioning from single-user to multi-user mode.

### What's the Main Change?

The primary alterations involve the management of authentication, now overseen by Supabase. The `User` table has undergone updates, including the addition of `user_id` and `email`, which are retrieved from the user table of Supabase's authentication schema through a trigger mechanism. You can locate the corresponding SQL code in `server/prisma/migration/q_7`.

In the context of single-user mode, I employed the `findUnique` function to retrieve bots and data. However, in the transition to multi-user mode, data retrieval necessitates the validation of both the `user_id` and `bot_id`, for which I've incorporated the `findFirst` function.

Modifications have been made to the file `server/src/plugin/jwt.ts` as well. It has been updated to validate Supabase JWT tokens in place of regular JWT tokens.

On the frontend, I've implemented the Supabase Auth UI, a comprehensive collection of components facilitating user authentication management. The implementation of this UI can be found in `app\ui\src\routes\login\root.tsx`. Currently, I've integrated functionalities like `magic link` and `GitHub login`, yet you possess the liberty to tailor these options according to your preferences. For more detailed guidance, refer to the [Supabase Auth UI documentation](https://supabase.com/docs/guides/auth/auth-helpers/auth-ui).

The remainder of the code remains consistent with the original Dialoqbase repository.

## Running Dialoqbase Multi-User with Docker

Let's explore the process of executing Dialoqbase Multi-User utilizing Docker.

## Step 1: Cloning the Repository

Begin by cloning the Dialoqbase multi-user repository:

```bash
git clone https://github.com/n4ze3m/dialoqbase-multi-user
```

It's important to note that this repository is a derivative of the original Dialoqbase repository v0.0.21, enhanced with essential files for enabling multi-user functionality. The original repository can be accessed [here](https:/github.com/n4ze3m/dialoqbase).

## Step 2: Setting up Supabase

For comprehensive information on configuring Supabase, consult the [Supabase documentation](https://supabase.com/docs).

The prerequisites comprise of `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `DATABASE_URL`, all of which can be located within your Supabase project settings.

## Step 3: Configuring Environment Variables

Due to the integration of Supabase, it's necessary to manually configure the environment variables before building the Docker image.

### Step 3.1: Configuring Environment Variables for the UI

Navigate to `app\ui\.env` and specify the following variables:

```bash
VITE_SUPABASE_URL=<SUPABASE_URL>
VITE_SUPABASE_ANON_KEY=<SUPABASE_ANON_KEY>
```

### Step 3.2: Configuring Environment Variables in the Docker Compose File

Visit the `docker` directory and open the `.env` file. Add the following essential environment variables:

- `SUPABASE_URL=<SUPABASE_URL>`
- `SUPABASE_ANON_KEY=<SUPABASE_ANON_KEY>`
- `DATABASE_URL=<DATABASE_URL>`

In addition to these, ensure that you include other mandatory environment variables necessary for the proper functioning of the application (refer to [Self-Hosting](/guide/self-hosting) for further insights).

## Step 4: Launching the Application

Once the environment variables are configured, employ the following command to initiate the application:

::: code-group

```sh [docker-compose]
docker-compose up -d
```

```sh [docker compose]
docker compose up -d
```

:::

This action will trigger the construction of the Docker image and establish the app on port 3000. Access the app by visiting `http://localhost:3000`.

## Optional Support and Contribution

While both the single-user and multi-user versions of Dialoqbase remain freely accessible as open-source resources, it's worth considering extending your support to the developer by means such as:

- Ko-fi: [https://ko-fi.com/n4ze3m](https://ko-fi.com/n4ze3m)
- GitHub Sponsors: [GitHub Sponsors](https://github.com/sponsors/n4ze3m)

Contributions of this nature significantly contribute to the continual development and enhancement of the project.

As a reminder, you're welcome to utilize Dialoqbase as per your requirements, but it's important to note that I won't be available to provide support. If you're inclined to contribute to the project, you can do so by creating a fork of the repository and subsequently initiating a pull request. I'll gladly review and merge it if it meets the necessary criteria.

Furthermore, please acknowledge that I bear no responsibility for any consequences resulting from the utilization of this project. It's essential to exercise caution and employ it at your own risk, considering that I haven't accepted any investments from any parties.

## Licensing Information

Dialoqbase operates under the terms and conditions of the MIT License.

## Resources

- [Dialoqbase Multi-User Repository](https://github.com/n4ze3m/dialoqbase-multi-user)

- [Dialoqbase Multi-User Demo](https://asojdaspuxjwsos.n4ze3m.com/) ~ donot use this for production

- [Dialoqbase Repository](https://github.com/n4ze3m/dialoqbase)

- [Supabase Documentation](https://supabase.com/docs)

- [Supabase Auth UI Documentation](https://supabase.com/docs/guides/auth/auth-helpers/auth-ui)

- [Prisma Documentation](https://www.prisma.io/docs)
