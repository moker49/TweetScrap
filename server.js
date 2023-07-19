import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()
import { Client, IntentsBitField, EmbedBuilder } from 'discord.js';

const COLOR_SHIFT = 0xf4c310;

const client = new Client({
    intents:[
        IntentsBitField.Flags.Guilds
    ]
});
client.login(process.env.DISCORD_TOKEN);

client.on("ready", () => {
    console.log(`${client.user.tag} online.`)
    guild = client.guilds.cache.find
    
    setInterval(checkKey, 600000);
});

function checkKey(){
    let data = fs.readFileSync("last.json", "utf-8");
	let last = JSON.parse(data);
    if (last.status === 'pending'){
        console.log('syncing new tweet')
        loadChannels()
        sendMessage(last)
        updateKey(last)
    }
}

function loadChannels(){
    let data = fs.readFileSync("channels.json", "utf-8");
	channels = JSON.parse(data);
}

function sendMessage(last){
    let keyMsg = 'Platform: Universal\n```' + last.key + '```Redeem in-game or [here](https://shift.gearboxsoftware.com/rewards).'
    const embed_msg = new EmbedBuilder();
    embed_msg.setColor(COLOR_SHIFT);
    embed_msg
		.setTitle(':GoldenKey: Borderlands 2 | Borderlands 3 | Wonderlands')
		.setDescription(keyMsg)
        .setFooter({ text: `${last.expire_date}`, iconURL: 'https://i.imgur.com/GBh8nCB.png' });

    let data = fs.readFileSync("channels.json", "utf-8");
    let channels = JSON.parse(data);

    channels.forEach(function(shift_channel) {
        shift_channel = client.channels.cache.find(c => c.id === SHIFT_CHANNEL_ID);
        shift_channel.send('@SHiFT Codes');
        shift_channel.send({embeds: [embed_msg]});
    });
}

function updateKey(last){
    last.status = "sent"
    fs.writeFileSync("last.json", JSON.stringify(last));
}