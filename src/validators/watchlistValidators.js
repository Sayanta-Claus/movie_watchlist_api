// for each route having a body,
//we need to validate the data in the body
// so we will create a middleware for validation using zod
//here we will our schema for validation

import { z } from "zod";

const addToWatchlistSchema = z.object({
  movieId: z.string().uuid(), //validate uuid string
  status: z
    .enum(["PLANNED", "WATCHING", "COMPLETED", "DROPPED"], {
      error: () => {
        message: "Status must be one of: PLANNED, WATCHING, COMPLETED, DROPPED";
      },
    })
    .optional(), //can be optional as well
  rating: z.coerce //convert string to number if possible
    .number()
    .int("rating must be an integer") //inside quotes we can give error messages
    .min(1)
    .max(10)
    .optional(),
  notes: z.string().optional(),
});

export { addToWatchlistSchema };
