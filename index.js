import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()
import { Client } from 'discord.js';

let shift_channel;
const SHIFT_CHANNEL_ID = '321789236795670528'
const COLOR_SHIFT = 0xf4c310;

const client = new Client({
    intents:[]
});
client.login(process.env.DISCORD_TOKEN);

client.on("ready", (c) => {
    console.log(`${c.user.tag} online.`)
    shift_channel = client.channels.cache.get(SHIFT_CHANNEL_ID);
    // setInterval(checkKey, 10000);
    checkKey();
});

function checkKey(){
    let data = fs.readFileSync("last.json", "utf-8");
	let last = JSON.parse(data);
    if (last.status === 'pending'){
        sendMessage(last)
        updateKey(last)
    }
}

function sendMessage(last){
    let keyMsg = 'Platform: Universal\n' + last.expore_date + '\n```' + last.key + '```'
    console.log('create msg')
    // const embed_msg = new MessageEmbed();
    // embed_msg.setColor(COLOR_SHIFT);
    // embed_msg
	// 	.setAuthor('Borderlands 2, Borderlands 3, and Wonderlands')
	// 	.setDescription(keyMsg)
	// 	.setTimestamp();
    console.log('wait send')
    // shift_channel.send('test');
    console.log('send send')
}

function updateKey(last){
    console.log('check key')
    fs.writeFileSync("last.json", JSON.stringify(last));
}