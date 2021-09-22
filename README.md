# discord-music-bot

Bot for playing music on discord RIP dyno groovy, using https://www.npmjs.com/package/@discordjs/voice

# Dev setup and hosting

1. Clone repo

2. Populate `.env` with variables shown in `.env.example`, use your Discord Bot Token and Google API Key. 

3. To build TypeScript and start the bot, run `npm run dev`

* For hosting on Heroku, set variables in `.env` as config variables and it should work similarly.

# Usage

1. There are various tutorial that guides how to register a bot in Discord, any of them would work as long as it is granted minimum permissions below

![image](https://user-images.githubusercontent.com/45516852/134271098-54c2095c-9875-4316-ace3-db2ff704fe63.png)

2. Bot owner should run "!deploy" to register the commands in the channel (one time only).

3. Then command suggestions from the bot should be available when you type "/"
