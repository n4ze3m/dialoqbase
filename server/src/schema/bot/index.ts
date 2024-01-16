import { FastifySchema } from "fastify";

export const chatRequestSchema: FastifySchema = {
  tags: ["Widget"],
  summary: "API to send message to bot",
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: {
        type: "string",
      },
    },
  },
  body: {
    type: "object",
    required: ["message"],
    properties: {
      message: {
        type: "string",
      },
      history: {
        type: "array",
      },
    },
  },
};

export const chatStyleSchema: FastifySchema = {
  tags: ["Widget"],
  summary: "API to get style of widget",
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: {
        type: "string",
      },
    },
  },
};

export const chatRequestStreamSchema: FastifySchema = {
  tags: ["Widget"],
  summary: "API to get stream of message from bot",
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: {
        type: "string",
      },
    },
  },
  //   querystring: {
  //     type: "object",
  //     required: ["message", "history"],
  //     properties: {
  //       message: {
  //         type: "string",
  //       },
  //       history: {
  //         type: "string",
  //       },
  //     },
  //   },
};

export const chatAPIRequestSchema: FastifySchema = {
  tags: ["Widget"],
  summary: "Public API to send message to bot on widget",
  headers: {
    type: "object",
    required: ["x-api-key"],
    properties: {
      "x-api-key": {
        type: "string",
      },
    },
  },
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: {
        type: "string",
      },
    },
  },

  body: {
    type: "object",
    required: ["message"],
    properties: {
      message: {
        type: "string",
      },
      history: {
        type: "array",
        default: [],
      },
      history_id: {
        type: "string",
      },
    },
  },
};
