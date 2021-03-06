const logPrefix = "Adapter[Console]: ";

const wait = t => new Promise(r => setTimeout(r, t));

const replyAndPrompt = client => (msg, logType = "log") => {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  console[logType].apply(null, msg.map(m => `${logPrefix}${m}`));
  client.prompt(true);
};

const platformActions = {
  "default-action"(client, reaction) {
    replyAndPrompt(client)(
      [`I don't know what to do with reaction type: ${reaction.type}`],
      "warn"
    );
  },
  ignore() {
    return;
  },
  error(client, reaction) {
    replyAndPrompt(client)(["errored Reaction", reaction], "error");
    replyAndPrompt(client)([`I have an error: ${reaction.error}`]);
  },
  "message-reply"(client, reaction) {
    const { message } = reaction;
    replyAndPrompt(client)([message.content]);
  },
  // 'set-presence'(client, reaction) {
  //   const { presence } = reaction;
  //   client.user.setPresence(presence);
  // },
  "adapter-ready"(client) {
    replyAndPrompt(client)([`logged in as OP Root User`]);
  }
};

const getAction = actionType =>
  actionType in platformActions
    ? platformActions[actionType]
    : platformActions["default-action"];

module.exports = client => action => {
  getAction(action.type)(client, action);
};
