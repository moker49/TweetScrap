import dotenv from 'dotenv'
dotenv.config()
import { REST, Routes, ApplicationCommandOptionType } from 'discord.js'

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

const commands = [
    {
        name: "shift",
        description: 'Toggle wether this channel should receive new SHiFT codes'
    },
    {
        name: "tag",
        description: "Tag a role every time a new SHiFT code is posted",
        options: [
            {
                name: "role",
                description: "Which role should be tagged",
                type: ApplicationCommandOptionType.Role,
                required: true
            }
        ]
    }
]

registerCommands()
async function registerCommands() {
    try {
        console.log('attempting to register coommands')
        await rest.put(
            Routes.applicationCommands(process.env.APP_ID),
            {
                body: commands
            }
        )
        console.log('registered coommands')
    } catch (error) {
        console.log(error)
    }
}