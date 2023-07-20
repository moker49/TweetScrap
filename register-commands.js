import dotenv from 'dotenv'
dotenv.config()
import { REST, Routes } from 'discord.js'

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('attempting to register coommands')
        await rest.put(
            Routes.applicationCommands(process.env.APP_ID),
            {
                body: [
                    {
                        name: "shift",
                        description: 'Toggle wether this channel is subscribed or not'
                    }
                ]
            }
        )
        console.log('registered coommands')
    } catch (error) {
        console.log(error)
    }
})()