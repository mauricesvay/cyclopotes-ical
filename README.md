# cyclopotes-ical

A Node.js tool to fetch cycling events from [cyclopotes.cc](https://cyclopotes.cc) and generate an iCal (`.ics`) file. It can also upload the generated file to an AWS S3 bucket.

## Features

- Fetches events from `https://cyclopotes.cc/events` (POST request).
- Generates an iCal file with event details (summary, description, time).
- Optionally uploads the `.ics` file to S3.
- Can run as a standalone script or as an HTTP server.

## Usage

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file (see `.env.example`).
3. Run the script:
   ```bash
   npm start
   ```

### Docker

You can run the application using Docker Compose.

1. Build and start the container:
   ```bash
   docker-compose up --build
   ```
2. The server will be available at `http://localhost:3000`.
   - `GET /` or `GET /calendar` returns the generated iCal file.

### Environment Variables

See `.env.example` for a full list of supported variables.

- `EVENT_URL`: URL to fetch events from.
- `HTTP_SERVER`: Set to `true` to run as an HTTP server.
- `PORT`: Port to listen on (default: 3000).
- `S3_BUCKET`: S3 bucket name for uploading the `.ics` file.
- `S3_KEY`: S3 object key (filename).
- `AWS_REGION`: AWS region.
