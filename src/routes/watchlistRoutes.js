import express from "express";
import {
    addToWatchlist,
    removeFromWatchlist,
    updateWatchlistItem,
} from "../controllers/watchlistController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { addToWatchlistSchema } from "../validators/watchlistValidators.js";
const router = express.Router(); //to keep api routes together here
// router.get("/hello", (req, res) => {
//   res.json({ message: "Hello world from movie api!" });
// });

//the middleware will run before any route handler and checks if the jwt token is valid for the user and that the user can add to watchlist or not
router.use(authMiddleware);
//now the middleware run only before this route
// router.post("/", authMiddleware, addToWatchlist);
router.post("/", validateRequest(addToWatchlistSchema), addToWatchlist);
// router.post("/login", login);
// router.post("/logout", logout);

//send id through params for put or delete
router.delete("/:id", removeFromWatchlist);

router.put("/:id", updateWatchlistItem);

export default router;
//before any route access, we authorize whether user can access the
//routes through middleware and tokens and cookies
