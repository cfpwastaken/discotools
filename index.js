const { APIMessage, MessageEmbed } = require("discord.js");

class DiscoTools {
    constructor(_client) {
        this.client = _client;
    }
    setup = async function () {
        this.client.ws.on("INTERACTION_CREATE", async (interaction) => {
            if(interaction.type === 3) {
                // Button interaction
                const id = interaction.data.custom_id;
                this.client.emit("button", interaction, id);
            } else if(interaction.type === 2) {
                // Slash command
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
            }
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
    reply = async function (interaction, response, resp2) {
        let data = {
            content: response
        };
        
        if(resp2) {
            var components = [];
            for(const resp in resp2) {
                components.push({
                    type: resp2[resp].getType(),
                    label: resp2[resp].getLabel(),
                    style: resp2[resp].getStyle(),
                    custom_id: resp2[resp].getId()
                });
            }
            this.client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        content: response,
                        components: [
                            {
                                type: 1,
                                components
                            }
                        ]
                    }
                }
            });
            return;
        } else if(typeof response === 'object') {
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
    startVoiceActivity = async function (channel, activity) {
        if(activity === "yt") {
            activity = "755600276941176913";
        } else if(activity === "fishing") {
            activity = "814288819477020702";
        } else if(activity === "amongus") {
            activity = "773336526917861400";
        }
        const response = await bot.api.channels(channel.id).invites.post({
            data: {
                max_age: 86400,
                max_uses: 0,
                target_application_id: activity,
                target_type: 2,
                temporary: false,
                validate: null
            },
        });
        return response.code;
    }
}

class Button {
    constructor(type, label, style, id) {
        this.type = type;
        this.label = label;
        this.style = style;
        this.id = id;
    }
    getType = () => {
        return this.type;
    }
    getLabel = () => {
        return this.label;
    }
    getStyle = () => {
        return this.style;
    }
    getId = () => {
        return this.id;
    }
}


module.exports.DiscoTools = DiscoTools;
module.exports.Button = Button;