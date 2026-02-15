import { prisma } from "../config/db.js";

//add movies to our watchlist
const addToWatchlist = async (req, res) => {
  const { movieId, status, rating, notes } = req.body;

  //verify movie exists
  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
  });
  if (!movie) {
    return res.status(404).json({
      error: "Movie not found",
    });
  }

  //check if already added(using both userId and movieId since it is unique)
  const existingInWatchlist = await prisma.watchlistItem.findUnique({
    where: {
      userId_movieId: {
        userId: req.user.id,
        movieId: movieId,
      },
    },
  });

  if (existingInWatchlist) {
    return res.status(400).json({ error: "Movie already there" });
  }
  //add to watchlist
  const watchlistItem = await prisma.watchlistItem.create({
    data: {
      userId: req.user.id,
      movieId,
      status: status || "PLANNED",
      rating,
      notes,
    },
  });

  res.status(201).json({
    status: "success",
    data: {
      watchlistItem,
    },
  });
};

const removeFromWatchlist = async (req, res) => {
  //find watchlist item and verify ownership
  const watchlistItem = await prisma.watchlistItem.findUnique({
    where: {
      id: req.params.id,
    },
  });

  if (!watchlistItem) {
    return res.status(404).json({
      error: "Watchlist item not found",
    });
  }

  //ensure only owner can delete
  if (watchlistItem.userId !== req.user.id) {
    return res.status(403).json({
      error: "Not allowed",
    });
  }
  await prisma.watchlistItem.delete({
    where: {
      id: req.params.id,
    },
  });

  res.status(200).json({
    status: "success",
    message: "Removed from watchlist",
  });
};

/**
 * Update watchlist item
 * Updates status, rating, or notes
 * Ensures only owner can update
 * Requires protect middleware
 */
const updateWatchlistItem = async (req, res) => {
  const { status, rating, notes } = req.body;

  // Find watchlist item and verify ownership
  const watchlistItem = await prisma.watchlistItem.findUnique({
    where: { id: req.params.id },
  });

  if (!watchlistItem) {
    return res.status(404).json({ error: "Watchlist item not found" });
  }

  // Ensure only owner can update
  if (watchlistItem.userId !== req.user.id) {
    return res
      .status(403)
      .json({ error: "Not allowed to update this watchlist item" });
  }

  // Build update data
  const updateData = {};
  if (status !== undefined) updateData.status = status.toUpperCase();
  if (rating !== undefined) updateData.rating = rating;
  if (notes !== undefined) updateData.notes = notes;

  // Update watchlist item
  const updatedItem = await prisma.watchlistItem.update({
    where: { id: req.params.id },
    data: updateData,
  });

  res.status(200).json({
    status: "success",
    data: {
      watchlistItem: updatedItem,
    },
  });
};

export { addToWatchlist, removeFromWatchlist, updateWatchlistItem };
