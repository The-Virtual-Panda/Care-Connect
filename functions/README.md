# Readme

## For Development

Make sure you change the variables in `.env` to target dev. There is currently no override.

- NODE_ENV=dev
- USE_EMULATOR=true

## For Targeting Live

Check the `.env.prod` file which has service account credentials.

## Loading new rules

- ChatGPT that thing
- Insert stuff into `upload-latest-rules.ts`
- From the functions directory
  - Run `npm run build`
  - Run the file with the command `npx ts-node .\test\upload-latest-rules.ts`
  - Check rules with command `npx ts-node .\test\check-live-rule.ts`
