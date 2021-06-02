const { APIMessage, MessageEmbed } = require("discord.js");

class DiscoTools {
    constructor(_client) {
        this.client = _client;
    }
    setup = async function () {
        this.client.ws.on("INTERACTION_CREATE", async (interaction) => {
            const { options } = interaction.data;
            const command = interaction.data.name.toLowerCase();

            const args = {};

            if(options) {
                for(const option of options) {
                    const { name, value } = option;
                    args[name] = value;
                }
            }

            this.client.emit("command", interaction, command, args);
        });
    }
    embed = (title, desc, color, footer) => {
        let embed = new MessageEmbed()
            .setTitle(title)
            .setDescription(desc)
            .setColor(color)
            .setFooter(footer);
        return embed;
    }
    createAPIMessage = async function (interaction, content) {
        const { data, files } = await APIMessage.create(
            this.client.channels.resolve(interaction.channel_id),
            content
        ).resolveData().resolveFiles();
    
        return { ...data, files };
    }
    reply = async function (interaction, response) {
        let data = {
            content: response
        };
    
        if(typeof response === 'object') {
            // data = await this.createAPIMessage(interaction, response);       doesn't work
            const { data: da, files } = await APIMessage.create(
                this.client.channels.resolve(interaction.channel_id),
                response
            ).resolveData().resolveFiles();
    
            data = { ...da, files };
        }
    
        this.client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 4,
                data
            }
        });
    }
    newGuildCommand = async function (guildId, name, description, options) {
        if(!options) options = [];
        await this.client.api.applications(this.client.user.id).guilds(guildId).commands.post({
            data: {
                name: name,
                description: description,
                options
            },
        });
    }
    newGlobalCommand = async function (name, description, options) {
        if(!options) options = [];
        await this.client.api.applications(this.client.user.id).commands.post({
            data: {
                name: name,
                description: description,
                options
            },
        });
    }
    deleteGuildCommand = async function (guildId, commandId) {
        await this.client.api.applications(this.client.user.id).guilds(guildId).commands(commandId).delete();
    }
    deleteGlobalCommand = async function (commandId) {
        await this.client.api.applications(this.client.user.id).commands(commandId).delete();
    }
}


module.exports.DiscoTools = DiscoTools;