# AI_Nginx

Custom Nginx container project managed via Docker Compose.

## How to run

1. Make sure you have [Docker](https://docs.docker.com/get-docker/) installed.
2. Run the following command:
   ```bash
   docker compose up -d
   ```
3. Open [http://localhost:8080](http://localhost:8080) in your browser.

## CI/CD
This project uses GitHub Actions to verify that the Docker image builds correctly on every push.
