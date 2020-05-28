# BLACKOUT bot

The Discord bot for BLACKOUT.

This receives presence updates from the Discord WebSocket gateway, filters them to just bot accounts, and then publishes the information as messages over RabbitMQ to the server.
The message format just stores the time of recording, the bot ID, and whether or not the bot is online.
An account is determined to be online if their presence status isn't offline (ex. away is considered online).
