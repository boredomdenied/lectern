import { Command } from 'discord-akairo'

class RTTCommand extends Command {
  constructor () {
    super('rtt', {
      aliases: ['rtt'],
      category: 'Lecture',
      description: {
        name: 'Related To That',
        short: 'Related to that...',
        long: 'Request to make a point that\'s _tangentially_ related to the current topic',
        usage: '?rtt'
      },
      channel: 'guild',
      userPermissions: ['SEND_MESSAGES']
    })
  }

  async exec (message) {
    const channel = await this.client.channels.cache.get(this.client.config.lectures.channels.lectureQueue)
    const messages = await channel.messages.fetch({ limit: 10 })
    const filtered = await messages.filter(message => message.embeds.length !== 0 && message.embeds[0].footer.text === 'Lecture Queue')

    if (filtered.size >= 1) {
      const queueMessage = filtered.first()
      const oldEmbed = queueMessage.embeds[0]
      const rtt = queueMessage.embeds[0].fields[2].value.split('\n')

      if (rtt.includes(message.member.displayName)) {
        return message.reply('You are already in the **Related To That** queue.')
      }

      if (rtt.includes('─')) {
        rtt.pop()
      }

      rtt.push(message.member.displayName)

      const newEmbed = this.client.util.embed(oldEmbed)
        .spliceFields(2, 1, {
          name: ':raised_hands: Related To That',
          value: rtt
        })

      queueMessage.edit(newEmbed)
      return message.reply('Your request was added to the queue.')
    } else {
      return message.util.send('There is no lecture happening right now.')
    }
  }
}

export default RTTCommand
