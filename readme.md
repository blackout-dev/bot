# BLACKOUT bot

The Discord bot for BLACKOUT.

This receives presence updates from the Discord WebSocket gateway, filters them for just bots, and then publishes the information as messages over RabbitMQ to the server.
