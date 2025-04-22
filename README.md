# app.marakusa.me

The frontend of a web app for managing licenses from marketplace sites such Jinxxy, Gumroad, and Lemon Squeezy.

## Requirements

Under `src` include file `public.config.json` in the following format:
```json
{
    "apiPath": "https://apiserver",
    "apiVersion": "API_SERVER_API_VERSION",
    "cdnPath": "https://cdnserver",
    "discordClientId": "CLIENT_ID",
    "discordRedirectUri": "https://frontendserver/auth?platform=discord&state={STATE}",
    "gumroadClientId": "CLIENT_ID",
    "gumroadRedirectUri": "https://frontendserver/auth?platform=gumroad&state={STATE}",
    "gumroadProducts": {
        "PRODUCT_ID": "PRODUCT_NAME",
        "PRODUCT_ID": "PRODUCT_NAME",
        "PRODUCT_ID": "PRODUCT_NAME"
    },
    "lemonSqueezyProducts": {
        "PRODUCT_ID": "PRODUCT_NAME",
        "PRODUCT_ID": "PRODUCT_NAME",
        "PRODUCT_ID": "PRODUCT_NAME"
    },
    "jinxxyProducts": {
        "PRODUCT_ID": "PRODUCT_NAME",
        "PRODUCT_ID": "PRODUCT_NAME",
        "PRODUCT_ID": "PRODUCT_NAME"
    }
}
```

## How to run

NOTICE: The frontend requires a backend server and cdn server running.
```
npm i
npm run dev
```
