import { Command } from 'discord-akairo'

class StartLectureCommand extends Command {
  constructor () {
    super('start', {
      aliases: ['start', 'open'],
      category: 'Moderator',
      description: {
        name: 'Start Lecture',
        content: 'Open a lecture queue in the current channel',
        usage: '!start <topic>'
      },
      channel: 'guild',
      userPermissions: ['BAN_MEMBERS']
    })
  }

  * args () {
    const topic = yield {
      match: 'rest',
      prompt: {
        start: 'Enter the topic for this lecture.'
      }
    }

    return { topic }
  }

  async exec (message, { topic }) {
    await message.delete()

    const queue = this.client.util.embed()
      .setTitle(topic)
      .addField(':speech_left: Current Speaker', 'Waiting...')
      .addField(':point_up: On That Point', '---')
      .addField(':raised_hands: Related To That', '---')
      .addField(':thinking: Clarification Needed', '---')
      .setTimestamp()

    return message.util.send({ embed: queue })
  }
}

export default StartLectureCommand
