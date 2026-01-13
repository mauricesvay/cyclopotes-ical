# cyclopotes-ical

## How it is implemented

This application runs on Node.js (at least v18.17.1) on a Raspberry Pi server.
The application fetches events from `https://cyclopotes.cc/event` using an HTTP POST request.
By default the request body includes filters and the `start`/`end` dates set to the current month's first and last day (e.g. `{"start":"2026-01-01","end":"2026-01-31",...}`).
You can override the body by setting the `EVENT_POST_BODY` environment variable to a JSON string.
An example of the data is stored in `events.json`.

The list of events is transformed into the iCal format:
- the date is used as the start date of the event
- by default, the event duration is 2h
- the event title is the group name
- the event description contains:
  - the group description
  - the group URL

The various steps are logged to a configurable log file.

Once the iCal file is generated, it is uploaded to an S3 bucket specified in environment variables.
The `.env.example` file contains an example of the required env variables.
The file on the S3 bucket has the necessary permissions to be served over HTTP publicly.

## Usage

1. Copy `.env.example` to `.env` and edit env values (S3_BUCKET, S3_KEY, etc.)
2. Install dependencies: `npm install`
3. Generate the iCal file locally (use the bundled `events.json`):
   `USE_LOCAL_EVENTS=1 npm run generate`
4. Generate and upload to S3 (when `S3_BUCKET` is set):
   `npm run generate`
5. Logs are written to the file configured by `LOG_FILE` (default `./cyclopotes.log`).

### Environment variables

- `EVENT_URL` (default: https://cyclopotes.cc/event)
- `USE_LOCAL_EVENTS` set to `1` to use `events.json` instead of remote fetch
- `LOG_FILE` path for logs
- `S3_BUCKET`, `S3_KEY` for upload
- `AWS_REGION` (default `eu-west-1`) and AWS credentials via env or instance profile

