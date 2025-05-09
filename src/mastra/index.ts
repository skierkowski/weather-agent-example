import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';
import { weatherWorkflow } from './workflows';
import { weatherAgent } from './agents';
import { registerApiRoute } from "@mastra/core/server";

import { SlackMastraAdapter } from '@serverless/ai';

const adapterConfig = {
  slack: {
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    token: process.env.SLACK_BOT_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
  },
};

const slackAdapter = new SlackMastraAdapter(weatherAgent, adapterConfig);

/**
 * When SocketMode is disabled, we use the SlackMastraAdapter to register the
 * API Route with the Mastra server. If SocketMode is enabled, we don't add
 * any routes.
 */
const apiRoutes = [registerApiRoute("/slack", (slackAdapter as SlackMastraAdapter).route)];


export const mastra = new Mastra({
  workflows: { weatherWorkflow },
  agents: { weatherAgent },
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
  server: {
    apiRoutes,
  },
});
