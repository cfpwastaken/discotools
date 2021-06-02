# DiscoTool

## Installation

Do `npm i discotools`

## How to use

### Slash Commands

Because Discord.JS (at the time of writing this) does not support Slash Commands. But with this package you can use them anyway!

```js
const discord = require("discord.js");
const client = new discord.Client();
// Initialize DiscoTools
const DiscoTools = require("discotools");
const discotools = new DiscoTools.DiscoTools(client);
// Make sure this is async
client.on("ready", async () => {
    // Setup
    await discotools.setup();

    // New global command CAN TAKE UP TO 1H FOR DISCORD TO REGISTER
    await discotools.newGlobalCommand("commandname", "Command Description");

    // Guild-only commands (Registered instantly)
    await discotools.newGuildCommand("guildId", "commandname2", "Command 2 Description");

    // Arguments!
    await discotools.newGlobalCommand("args", "Argument Test", [
        {
            name: "arg1needstobelowercase",
            description: "Some Description",
            required: true,
            type: 3 // 3 = string, 4 = int others yet unknown. ArgumentType Class soon
        }
    ]);

    // Command Event!
    bot.on("command", async (interaction, command, args) => {
        if(command === "commandname") {
            // Reply to command with a message
            discotools.reply(interaction, "Response!");
        } else if(command === "commandname2") {
            // Reply to command with embed
            const testembed = embed("Title", "Description", "RANDOM", "Footer");

            reply(interaction, testembed)
        } else if(command === "args") {
            // Get arguments
            const testembed = embed("Title", "Description", "RANDOM", "Footer");

            for(const arg in args) {
                const value = args[arg];
                testembed.addField(arg, value);
            }

            reply(interaction, testembed);
        }
    });

    // Create API Messages (you don't actually need to know this)
    const apimessage = await discotools.createAPIMessage(interaction, content);

    // Delete commands
    await discotools.deleteGuildCommand("guildId", "commandId");
    await discotools.deleteGlobalCommand("commandId");
})
```

More very soon!
