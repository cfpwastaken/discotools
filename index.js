const { APIMessage, MessageEmbed } = require("discord.js");

var client;

function discotools(client) {
    this.client = client;
    return this;
}

discotools.embed = (title, desc, color, footer) => {
    let embed = new MessageEmbed()
        .setTitle(title)
        .setDescription(desc)
        .setColor(color)
        .setFooter(footer + " | ServerSystem");
        return embed;
};

discotools.createAPIMessage = async function (interaction, content) {
    const { data, files } = await APIMessage.create(
        client.channels.resolve(interaction.channel_id),
        content
    ).resolveData().resolveFiles();

    return { ...data, files };
};

discotools.reply = async function (interaction, response) {
    let data = {
        content: response
    };

    if(typeof response === 'object') {
        // data = await this.createAPIMessage(interaction, response);       doesn't work
        const { data: da, files } = await APIMessage.create(
            client.channels.resolve(interaction.channel_id),
            response
        ).resolveData().resolveFiles();

        data = { ...da, files };
    }

    client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: 4,
            data
        }
    });
};

discotools.newGuildCommand = async function (guildId, name, description, options) {
    if(!options) options = [];
    await client.api.applications(client.user.id).guilds(guildId).commands.post({
        data: {
            name: name,
            description: description,
            options
        },
    });
}

discotools.newGlobalCommand = async function (name, description, options) {
    if(!options) options = [];
    await client.api.applications(client.getBot().user.id).commands.post({
        data: {
            name: name,
            description: description,
            options
        },
    });
}

discotools.deleteGuildCommand = async function (guildId, commandId) {
    await client.api.applications(client.getBot().user.id).guilds(guildId).commands(commandId).delete();
}

discotools.deleteGlobalCommand = async function (commandId) {
    await client.api.applications(client.getBot().user.id).commands(commandId).delete();
}

module.exports.discotools = discotools;