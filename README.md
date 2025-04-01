<div align="center">

# BetterCD

![GitHub License](https://img.shields.io/github/license/72mins/bettercd)

<img alt="BetterCD" width="1000" src="https://bettercd.dev/og.png">

</div>

<br />

Graphical CI/CD Pipeline Builder.

## Running Locally / Self-Hosting

The project is separated into a frontend and backend directories. The frontend
directory is a React application that uses Vite for development and build.
The backend directory is a Django application that uses Django REST
Framework for the API.

The project also requires the use of Cloudflare R2 for storage, Google Cloud
for pipeline execution and a GitHub application for repository access.

### Backend

#### Prerequisites

- Python 3.8 or higher
- uv

#### Environment Setup

The backend uses uv and a .env file to manage environment variables and packages.

1. Change to the backend directory:

   ```bash
   cd backend
   ```

2. Create a virtual environment and install the required packages:

   ```bash
   uv sync
   ```

   This will create a virtual environment in the `.venv` directory and install
   the required packages in it. You can manually activate the virtual environment
   by running:

   ```bash
   source .venv/bin/activate
   ```

3. Setting up the environment variables:

   Copy the `project/.env.example` file to `project/.env` and update the values
   as needed. The project uses Cloudflare R2 for storage, GitHub for
   repository access, PostgreSQL for the database, and Celery for asynchronous
   tasks.

   1. Generate a Django secret key using [Djecrety](https://djecrety.ir/) and
      update the `DJANGO_SECRET_KEY` variable in the `.env` file.

   2. Set the `DEBUG` variable to `True` for development and `False` for production.

   3. Set the `ALLOWED_HOSTS` variable to `localhost` for development and
      `your-domain.com` for production.

   4. Set up the `CORS_ALLOWED_ORIGINS` variable to allow requests from the frontend
      application. For development, set it to `http://localhost:3000` and for
      production, set it to your frontend domain.

   5. Set the database variables to the appropriate values for your created
      PostgreSQL database. The default values are:

   6. **Cloudflare R2**: Create a Cloudflare account and set up a R2 Object
      Storage bucket. Get the Access and Secret keys, bucket name and endpoint URL.
      With these values, update the variables in the `.env` file:

   7. **Google Cloud**: Create a Google Cloud account. Create a new project and
      set the variable `GCLOUD_PROJECT_ID` to that project ID.

      Create a new service
      account with permissions for Cloud Run, Artifact Registry and Pub/Sub. Download
      the service account key in JSON format, rename it to service-account.json
      and place it at the root of the backend directory.

      Choose a region you want to use and set the `GCLUD_REGION` variable to that.

      Head to the artifact registry and create a new repository called `script-repo`.
      Build and upload the Dockerfile from the `base-image` directory to the repository.
      Make sure to set the image name to base-image and the tag to latest.

      Create a new Pub/Sub topic where all the logs will be sent to.
      Head to the logging section and create a new sink in the `Log Router` section.
      Choose the Pub/Sub topic you created and set the sink name to `bettercd-logs`.
      Set the inclusion filter to:

      ```bash
      resource.type="cloud_run_job"
      resource.labels.job_name=~"pipeline-job-*"
      severity="DEFAULT"
      ```

      Create a new subscription for the topic and set the delivery type to `Pull`,
      ack deadline to 10 seconds, retention to 2 hours, disable exactly once
      delivery and set the expiration to 31 days.

   8. **GitHub**: Head over to the Developer settings of your GitHub account
      and create a new GitHub app. with repository permissions.
      From there, copy the App ID and Name and set those environment
      variables in the `.env` file.

      Set the `GITHUB_CALLBACK_URL` variable to the URL of your frontend + `/dashboard/integrations`.
      For example: `http://localhost:3000/dashboard/integrations`.

      Finally, generate a private key for the app and place it wherever you
      want in the backend directory and set the `GITHUB_PRIVATE_KEY_PATH`
      variable to the path of the key. Make sure the key is named `github-private-key.pem`.

   9. **Celery**: The project uses Celery for asynchronous tasks. Make sure to set
      the `CELERY_BROKER_URL` variable to the URL of your Redis server.

4. Run the database migrations:

   All the migration files are prepared and ready to be used. Run the following command
   to apply the migrations to the database:

   ```bash
   python manage.py migrate
   ```

5. Create a superuser account:

   Create a superuser account to access the Django admin panel. The account
   can also be used to log in to the frontend application. To create a superuser
   account, run the following command and follow the prompts:

   ```bash
   python manage.py createsuperuser
   ```

6. Run the backend application:

   ```bash
   python manage.py runserver
   ```

### Celery

Running the Celery worker locally is needed for real-time log updates and
pipeline runs. To run the Celery worker, run the following command:

```bash
celery -A project worker --loglevel=INFO
```

**Caveat**: Sometimes the worker kills itself on MacOS. To fix this, run the
worker with the `--pool=solo` option:

```bash
celery -A project worker --loglevel=INFO --pool=solo
```

### Frontend

1. Change to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install the required packages:

   ```bash
   bun install
   ```

3. Set up the environment variables:

   Create a `.env` file in the frontend directory and set the following:

   ```env
   VITE_BE_URL=http://localhost:8000
   ```

   This will set the backend URL where the frontend will send requests to.

4. Run the frontend application:

   ```bash
   bun run dev
   ```
