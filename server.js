import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()
import { Client, IntentsBitField, EmbedBuilder } from 'discord.js'

const COLOR_SHIFT = 0xf4c310
const COLOR_NEGATIVE = 0x992d22
let channelIds
let tags


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

    loadChannels()
    loadTags()
    checkKeys()
    setInterval(checkKeys, process.env.COOLDOWN * 1000);
});

client.on("interactionCreate", (interaction) => {
    if (interaction.commandName === 'shift') {
        let channelId = interaction.channel.id
        let channelIndex = channelIds.indexOf(channelId)
        let title
        const embed_msg = new EmbedBuilder();
        if (channelIndex < 0) {
            channelIds.push(channelId)
            title = ':GoldenKey: Channel Subscribed!'
            embed_msg.setColor(COLOR_SHIFT);
        } else {
            channelIds.splice(channelIndex, 1)
            title = ':GoldenKey: Channel Unsubscribed!'
            embed_msg.setColor(COLOR_NEGATIVE);
        }
        saveChannels()
    } else if (interaction.commandName === 'tag') {
        let roleId = interaction.options.get('role')
        title = `:GoldenKey: Role will tagged: ${roleId}`
        embed_msg.setColor(COLOR_SHIFT);
        saveTag(interaction.guildId, roleId)
    } else{
        title = ':GoldenKey: Command not found'
        embed_msg.setColor(COLOR_NEGATIVE);
    }
    embed_msg.setTitle(title)
    interaction.reply({ embeds: [embed_msg], ephemeral: true })
});




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
    fs.writeFileSync("all_keys.json", JSON.stringify(all_keys))
}

function loadTags(){
    let data = fs.readFileSync("tags.json", "utf-8")
    tags = JSON.parse(data)
}

function saveTag(guildId, roleId){
    tags[guildId] = roleId
    let json = JSON.stringify(tags);
    fs.writeFile("tags.json", json, (err) => {
        if (err) {
            console.log(err);
        }
    });
}

function loadChannels() {
    let data = fs.readFileSync("channels.json", "utf-8")
    channelIds = JSON.parse(data)
}

function saveChannels() {
    let json = JSON.stringify(channelIds);
    fs.writeFile("channels.json", json, (err) => {
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

    channelIds.forEach(function (channelId) {
        let shift_channel = client.channels.cache.find(c => c.id === channelId)
        shift_channel.send({ embeds: [embed_msg] })
        if (shift_channel.guildId in tags) {
            let roleId = tags[shift_channel.guildId]
            shift_channel.send("<@&" + roleId);
        } else {
            console.log(`guild ${shift_channel.guild.name} does not have a tag set`)
        }
    });
}

