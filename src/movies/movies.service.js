const db = require("../db/connection");

async function list(is_showing) {
  return db("movies")
    .select("movies.*")
    .modify((queryBuilder) => {
      if (is_showing) {
        queryBuilder
          .join(
            "movies_theaters",
            "movies.movie_id",
            "movies_theaters.movie_id"
          )
          .where({ "movies_theaters.is_showing": true })
          .groupBy("movies.movie_id");
      }
    });
}

// Map critic info to separate category for each movie
const addCritics = (movies) => {
  return movies.map((movie) => {
    return {
      'review_id': movie.review_id,
      'content': movie.content,
      'score': movie.score,
      'created_at': movie.created_at,
      'updated_at': movie.updated_at,
      'critic_id': movie.critic_id,
      'movie_id': movie.movie_id,
      'critic': {
          'critic_id': movie.c_critic_id,
          'preferred_name': movie.preferred_name,
          'surname': movie.surname,
          'organization_name': movie.organization_name,
          'created_at': movie.c_created_at,
          'updated_at': movie.c_updated_at
      }
    };
  });
};

async function read(movie_id) {
  return db("movies as m")
    .select("m.*")
    .where({"m.movie_id": movie_id})
    .first();
}

async function listTheaters() {
  return db("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .join("theaters as t", "mt.theater_id", "t.theater_id")
    .select("t.*")
    .groupBy("t.theater_id");
}

// Overlapping critic info must be named for categorization in useCritics function
async function listReviews(movie_id) {
  return db("movies as m")
    .join("reviews as r", "m.movie_id", "r.movie_id")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select(
      "r.*", 
      "c.*", 
      "c.critic_id as c_critic_id", 
      "c.created_at as c_created_at", 
      "c.updated_at as c_updated_at"
    )
    .where({ "m.movie_id": movie_id })
    .then(addCritics);
}

module.exports = {
  list,
  read,
  listTheaters,
  listReviews,
};
