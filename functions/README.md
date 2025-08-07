# Readme

## For Development

Make sure you change the variables in `.env` to target dev. There is currently no override.

- NODE_ENV=dev
- USE_EMULATOR=true

## For Targeting Live

Check the `.env.override` file which has service account credentials.

## Running Files directly in the test directory

Using npx. Make sure that it does .env.override at the top if you want that.
Run like this `npx ts-node .\test\[file].ts`

### Admin Scripts

Grant admin role to a user:
`npx ts-node .\test\grant-role.ts grant USER_ID`

Revoke admin role from a user:
`npx ts-node .\test\grant-role.ts revoke USER_ID`

Or CLI Mode:
`npx ts-node .\test\grant-role.ts grant`

## Loading new rules

- ChatGPT that thing
- Insert stuff into `upload-latest-rules.ts`
- From the functions directory
  - Run `npm run build`
  - Run the file with the command `npx ts-node .\test\upload-latest-rules.ts`
  - Check rules with command `npx ts-node .\test\check-live-rule.ts`
