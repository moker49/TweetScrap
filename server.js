import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()
import { Client, IntentsBitField, EmbedBuilder } from 'discord.js'

const COLOR_SHIFT = 0xf4c310
let channelIds


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
    checkKey()
    setInterval(checkKey, process.env.COOLDOWN * 1000);
});

client.on("interactionCreate", (interaction) => {
    if (interaction.commandName === 'shift') {
        let channelId = interaction.channel.id
        let channelIndex = channelIds.indexOf(channelId)
        let title
        if (channelIndex < 0) {
            channelIds.push(channelId)
            title = ':GoldenKey: Channel Subscribed!'
        } else {
            channelIds.splice(channelIndex, 1)
            title = ':GoldenKey: Channel Unsubscribed!'
        }
        const embed_msg = new EmbedBuilder();
        embed_msg.setColor(COLOR_SHIFT);
        embed_msg
            .setTitle(title)
        saveChannels()
        interaction.reply({ embeds: [embed_msg], ephemeral: true })
    }
});




function checkKey() {
    let data = fs.readFileSync("last.json", "utf-8")
    let last = JSON.parse(data)
    if (last.status === 'pending') {
        console.log('syncing new tweet')
        sendMessage(last)
        updateKey(last)
    }
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

function sendMessage(last) {
    let keyMsg = 'Platform: Universal\n```' + last.key + '```Redeem in-game or [here](https://shift.gearboxsoftware.com/rewards).'
    const embed_msg = new EmbedBuilder();
    embed_msg.setColor(COLOR_SHIFT);
    embed_msg
        .setTitle(':GoldenKey: Borderlands 2 | Borderlands 3 | Wonderlands')
        .setDescription(keyMsg)
        .setFooter({ text: `${last.expire_date}`, iconURL: 'https://i.imgur.com/GBh8nCB.png' })

    channelIds.forEach(function (channelId) {
        let shift_channel = client.channels.cache.find(c => c.id === channelId)
        shift_channel.send({ embeds: [embed_msg] })
        shift_channel.send('@SHiFT Codes');
    });
}

function updateKey(last) {
    last.status = "sent"
    fs.writeFileSync("last.json", JSON.stringify(last))
}