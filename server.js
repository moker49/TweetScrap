import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()
import { Client, IntentsBitField, EmbedBuilder } from 'discord.js'

const COLOR_SHIFT = 0xf4c310
const COLOR_NEGATIVE = 0x992d22
let guilds


const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
});
client.login(process.env.DISCORD_TOKEN)


client.on("ready", () => {
    console.log(`${client.user.tag} online.`)

    loadGuilds()
    checkKeys()
    setInterval(checkKeys, process.env.COOLDOWN * 1000);
});

client.on("interactionCreate", (interaction) => {
    let title
    const embed_msg = new EmbedBuilder();
    if (interaction.commandName === 'shift') {
        createGuildIfEmpty(interaction)

        let channelId = String(interaction.channel.id)
        if (guilds[interaction.guildId].channelIds.indexOf(channelId) < 0) {
            guilds[interaction.guildId].channelIds.push(channelId)
            title = ':GoldenKey: Channel Subscribed!'
            embed_msg.setColor(COLOR_SHIFT);
        } else {
            let channelIdIndex = guilds[interaction.guildId].channelIds.indexOf(channelId)
            guilds[interaction.guildId].channelIds.splice(channelIdIndex, 1)
            title = ':GoldenKey: Channel Unsubscribed!'
            embed_msg.setColor(COLOR_NEGATIVE);
        }
        saveGuilds()
    } else if (interaction.commandName === 'tag') {
        createGuildIfEmpty(interaction)

        let role = interaction.options.get('role').role
        if (guilds[interaction.guildId].roleIds.indexOf(role.id) < 0) {
            guilds[interaction.guildId].roleIds.push(role.id)
            title = `:GoldenKey: Role will be tagged: ${role.name}`
            embed_msg.setColor(COLOR_SHIFT);
        } else {
            let roleIdIndex = guilds[interaction.guildId].roleIds.indexOf(role.id)
            guilds[interaction.guildId].roleIds.splice(roleIdIndex, 1)
            title = `:GoldenKey: Role won't be tagged: ${role.name}`
            embed_msg.setColor(COLOR_SHIFT);
        }
        saveGuilds()
    } else {
        title = ':GoldenKey: Command not found'
        embed_msg.setColor(COLOR_NEGATIVE);
    }
    embed_msg.setTitle(title)
    interaction.reply({ embeds: [embed_msg], ephemeral: true })
});



function createGuildIfEmpty(interaction) {
    if (!(interaction.guildId in guilds)) {
        guilds[interaction.guildId] = {
            "channelIds": [],
            "roleIds": []
        }
    }
}

function checkKeys() {
    let data = fs.readFileSync("all_keys.json", "utf-8")
    let all_keys = JSON.parse(data)

    let updated = false
    for (const key in all_keys) {
        if (all_keys[key][2] !== 'posted') {
            console.log('Broadcasting new code')
            sendMessage(key, all_keys[key])
            all_keys[key][2] = 'posted'
            updated = true
        }
    }
    if (updated) {
        updateKeys(all_keys)
    }
}

function updateKeys(all_keys) {
    fs.writeFileSync("all_keys.json", JSON.stringify(all_keys, null, 4))
}

function loadGuilds() {
    let data = fs.readFileSync("guilds.json", "utf-8")
    guilds = JSON.parse(data)
}

function saveGuilds() {
    let json = JSON.stringify(guilds, null, 4);
    fs.writeFile("guilds.json", json, (err) => {
        if (err) {
            console.log(err);
        }
    });
}

function sendMessage(key, value) {
    let redeem = 'Redeem In-Game or [Here](https://shift.gearboxsoftware.com/rewards).'
    const embed_msg = new EmbedBuilder();
    embed_msg.setColor(COLOR_SHIFT);
    embed_msg
        .setTitle(`:GoldenKey: ${value[0]}`)
        .setDescription('Platform: Universal\n```' + key + '```' + redeem)
        .setFooter({ text: value[1], iconURL: 'https://i.imgur.com/GBh8nCB.png' })

    for (let guildId in guilds) {
        guilds[guildId].channelIds.forEach(function (channelId) {
            let shift_channel = client.channels.cache.find(c => c.id === channelId)
            if (!shift_channel) { return }
            shift_channel.send({ embeds: [embed_msg] })
            guilds[guildId].roleIds.forEach(function (roleId) {
                shift_channel.send("<@&" + roleId + ">");
            });
        });
    }
}

