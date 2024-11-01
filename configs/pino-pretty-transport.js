import { PinoPretty } from 'pino-pretty';

function millisecondsToHumanReadable(ms) {
  const minutes = Math.floor(ms / 60_000);
  const seconds = Math.floor((ms % 60_000) / 1_000);
  const milliseconds = ms % 1_000;
  let result = '';

  if (minutes > 0) {
    result += `${minutes}m `;
  }

  if (seconds > 0 || minutes > 0) {
    result += `${seconds}s `;
  }

  if (milliseconds > 0) {
    result += `${milliseconds}ms`;
  }

  return result.trim();
}

/**
 * @param { import('pino-pretty').PrettyOptions } opts
 * @returns { import('pino-pretty').PrettyStream }
 */
function prettyTransport(opts) {
  return PinoPretty({
    ...opts,
    messageFormat(log, messageKey, levelLabel, { colors }) {
      let message = '';

      if ('req' in log) {
        const req = log.req;
        const reqId = log.reqId;
        message += `${colors.gray(`[${reqId}]`)} ${req.method ?? ''} ${req.url ?? ''} — `;
      }

      if ('res' in log) {
        const res = log.res;
        const reqId = log.reqId;
        const resTime = log.responseTime;

        const statusCode =
          res.statusCode >= 400
            ? colors.red(res.statusCode)
            : colors.green(res.statusCode);

        const hrResTime = millisecondsToHumanReadable(resTime);
        const responseTime =
          resTime >= 500 ? colors.red(hrResTime) : colors.green(hrResTime);

        const reqIdStr = `${colors.gray(`[${reqId}]`)} `;
        if (!message.includes(reqIdStr)) {
          message += reqIdStr;
        }

        message += `${statusCode}, ${responseTime} — `;
      }

      const textPayload = log[messageKey];
      return message + (textPayload ?? '');
    },
  });
}

export default prettyTransport;
