const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(request, response, next) {
  const movie = await service.read(request.params.movieId);
  if(movie) {
    response.locals.movie = movie;
    return next();
  }
  next({ status: 404, message: "Movie cannot be found" });
}

async function list(request, response) {
  const isShowing = request.query.is_showing;
  const data = await service.list(isShowing);
  response.json({ data });
}

async function read(request, response) {
  const { movie } = response.locals;
  response.json({ data: movie });
}

async function listTheaters(request, response) {
  const data = await service.listTheaters();
  response.json({ data });
}

async function listReviews(request, response) {
  const movieId = request.params.movieId;
  const data = await service.listReviews(movieId);
  response.json({ data });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(movieExists), read],
  listTheaters: [asyncErrorBoundary(movieExists), listTheaters],
  listReviews: [asyncErrorBoundary(movieExists), listReviews],
};
