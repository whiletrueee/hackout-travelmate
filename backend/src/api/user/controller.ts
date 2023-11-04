import { RouteHandler } from "fastify";
import {
  FetchSessionParamType,
  FetchUserHeaderType,
  UsernameType,
  ConfirmBookingSchema,
} from "@/api/user/models";
import DB from "@/loaders/mongo";
import { ZodError } from "zod";

export const handleUserFetch: RouteHandler<{ Headers: FetchUserHeaderType }> =
  async function (request, reply) {
    reply.status(200).send({
      message: "User Data Fetched!",
      userData: reply.locals.user,
      status: true,
    });
  };

export const handleUserProfileFetch: RouteHandler<{ Params: UsernameType }> =
  async function (request, reply) {
    const data = await (await DB())
      .collection("users")
      .findOne({ username: request.params.username });
    if (!data) {
      throw {
        message: "User not found",
        status_code: 404,
      };
    }
    reply.status(200).send({
      message: "User Data Fetched!",
      userData: {
        ...data,
        socials: {
          twitter: "https://twitter.com/hamilbots",
          instagram: "https://www.instagram.com/headout/",
          facebook: "https://kzilla.xyz/ZtaMa",
          youtube:
            "https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley",
        },
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce finibus augue a quam molestie, quis blandit justo pellentesque. Nulla auctor, erat sit amet bibendum gravida, ipsum quam condimentum turpis, eget placerat turpis mauris in lacus. Aenean pharetra quam id auctor aliquet. Fusce sed pretium neque. Nunc quis massa ultrices nunc.",
        destinations: [
          { name: "Pondicherry" },
          { name: "Leh & Ladakh" },
          { name: "Pragye" },
          { name: "Auckland, New Zealand" },
          { name: "Colosseum, Rome, Italy" },
        ],
        services: [
          {
            enabled: true,
            amount: 200,
            timeslot: 30,
            description:
              "Hey, wanna hangout with me and talk about new cities?",
            name: "Hangout with me",
            id: "xyz",
            next_available: 1699216993000,
          },
          {
            enabled: true,
            amount: 1000,
            timeslot: 90,
            description: "Very long discussions?",
            name: "Big one",
            id: "123",
            next_available: 1700080993000,
          },
          {
            enabled: true,
            amount: 100,
            timeslot: 10,
            description: "Quick chat and some questions,",
            name: "Quickie",
            id: "abc",
            next_available: 1699648993000,
          },
          {
            enabled: false,
            amount: 100,
            timeslot: 30,
            description:
              "Hey, wanna hangout with me and talk about new cities?",
            name: "[disabled] Hangout with me",
            id: "xyz",
            next_available: 1699216993000,
          },
        ],
      },
      status: true,
    });
  };

export const handleUserSessionFetch: RouteHandler<{
  Params: FetchSessionParamType;
}> = async function (request, reply) {
  const { username, sessionId } = request.params;
  const data = await (await DB()).collection("users").findOne({ username });
  if (!data) {
    throw {
      message: "User not found",
      status_code: 404,
    };
  }
  reply.status(200).send({
    message: "User Data Fetched!",
    userData: data,
    status: true,
    sessionId,
    serviceData: {
      enabled: true,
      amount: 200,
      timeslot: 30,
      description:
        "Hey there! I am your go-to Indian travel influencer, on a thrilling journey to uncover the wonders of my incredible homeland. Join me as I traverse the diverse landscapes, immerse in rich cultures, and unveil hidden treasures that make India truly extraordinary. Through my lens, I share not just destinations, but the soul-stirring stories behind them, offering travel enthusiasts a front-row seat to the beauty and magic that is uniquely India. Ready to explore together?",
      name: "Hangout with me",
      id: "xyz",
      next_available: 1699216993000,
      availability: {
        sun: {
          enabled: true,
          slots: ["1600", "1630", "1700", "1730"],
        },
        mon: {
          enabled: true,
          slots: ["1600", "1630", "1700", "1730"],
        },
        tue: {
          enabled: true,
          slots: ["1600", "1630", "1700", "1730"],
        },
        wed: {
          enabled: false,
          slots: ["1600", "1630", "1700", "1730"],
        },
        thur: {
          enabled: true,
          slots: ["1600", "1630", "1700", "1730"],
        },
        fri: {
          enabled: true,
          slots: ["1600", "1630", "1700", "1730"],
        },
        sat: {
          enabled: true,
          slots: ["1600", "1630", "1700", "1730"],
        },
      },
    },
  });
};

export const handleBookingConfirm: RouteHandler<{ Headers: FetchUserHeaderType }> =
  async function (request, reply) {
    try {
      const bookerData = reply.locals.user;
      const data = request.body;
      const parsedDara = ConfirmBookingSchema.parse(data);
      await (await DB())
        .collection("bookings")
        .insertOne({
          bookerUsername: (bookerData as any).username,
          ...parsedDara,
          createdAt: +new Date(),
        });
      reply.status(200).send({
        message: "Data stored successfully!",
        status: true,
      });
    } catch (err) {
      throw {
        message: (err as ZodError).message ?? "Failed to validate data",
        status_code: 421,
      };
    }
  };
