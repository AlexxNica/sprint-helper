const isNumber = require('is-number')
const isUrl = require('is-url')
const url = require('url')

function validateMessage (message, botName) {
  var stream = null

  if (typeof message[0] === 'object' || message[0].slice(0, botName.length) !== botName) {
    return
  }

  if (['next', 'now'].includes(message[1])) {
    return {
      type: message[1]
    }
  }

  if (message.length !== 6) {
    return {
      type: 'error',
      error: 'Not enough arguments!'
    }
  }

  // shell-quote will escape ? by making it an object with the URL being in pattern
  // This fixes that possibility
  if (message[5] && message[5].pattern) {
    stream = message[5].pattern
  } else if (message[5] && typeof message[5] === 'string') {
    stream = message[5]
  }

  return {
    type: 'template',
    topic: (message[1] && typeof message[1] === 'string') ? message[1] : null,
    sprintIssue: (message[2] && isNumber(message[2])) ? `https://github.com/ipfs/pm/issues/${message[2]}`
      : (message[2] && url.parse(message[2]).hostname === 'github.com') ? message[2]
      : null,
    notes: (message[3] && isUrl(message[3])) ? message[3] : null,
    zoom: (message[4] && isUrl(message[4])) ? message[4] : null,
    stream: stream
  }
}

function checkAllArgs (message) {
  if (message.error) {
    return false
  }
  return (message.topic !== null &&
    message.sprintIssue !== null &&
    message.notes !== null &&
    message.zoom !== null &&
    message.stream !== null)
}

module.exports = {
  validateMessage: validateMessage,
  checkAllArgs: checkAllArgs
}
