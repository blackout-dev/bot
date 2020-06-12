# BLACKOUTS bot

The Discord bot for BLACKOUTS.

This receives presence updates from the Discord WebSocket gateway, filters them to just bot accounts, and then publishes the information as messages over RabbitMQ to the server.
The message format just stores the time of recording, the bot ID, and whether or not the bot is online.
An account is determined to be online if their presence status isn't offline (ex. away is considered online).

## Running

### Environment variables

| Environment variable                                                                                            | Description                                              |
| --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `DISCORD_TOKEN`                                                                                                 | Discord bot token                                        |
| `AMQP_URI`                                                                                                      | AMQP URI for RabbitMQ                                    |
| `MEILI_SEARCH_HOST`                                                                                             | MeiliSearch host                                         |
| [`MEILISEARCH_PRIVATE_KEY`](https://docs.meilisearch.com/guides/advanced_guides/authentication.html#master-key) | MeiliSearch API token with permissions to update indexes |
