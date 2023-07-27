const reviews = [
  {
    id: "101",
    author_id: "1001",
    game_id: "1",
    rating: 4,
    content: "The game is awesome, but it could use some more content.",
  },
  {
    id: "102",
    author_id: "1002",
    game_id: "2",
    rating: 5,
    content: "Absolutely love it! Best game ever!",
  },
  {
    id: "103",
    author_id: "1003",
    game_id: "3",
    rating: 3,
    content: "The graphics are great, but the controls need improvement.",
  },
  {
    id: "104",
    author_id: "1001",
    game_id: "3",
    rating: 4,
    content: "Enjoyed playing the game with friends.",
  },
  {
    id: "105",
    author_id: "1002",
    game_id: "1",
    rating: 2,
    content: "Disappointing. Not as good as I expected.",
  },
  {
    id: "106",
    author_id: "1003",
    game_id: "2",
    rating: 5,
    content: "A masterpiece. Must-play for all gamers!",
  },
  {
    id: "107",
    author_id: "1001",
    game_id: "2",
    rating: 4,
    content: "Well-designed levels and challenging gameplay.",
  },
  {
    id: "108",
    author_id: "1002",
    game_id: "1",
    rating: 3,
    content: "Decent game, but too short.",
  },
  {
    id: "109",
    author_id: "1003",
    game_id: "3",
    rating: 5,
    content: "Incredible storyline and captivating characters.",
  },
  {
    id: "110",
    author_id: "1001",
    game_id: "2",
    rating: 1,
    content: "Terrible controls and numerous bugs.",
  },
];

const games = [
  {
    id: "1",
    title: "The Legend of Questria",
    platforms: ["PC", "PlayStation 5", "Xbox Series X"],
  },
  {
    id: "2",
    title: "Galactic Adventures",
    platforms: ["Nintendo Switch", "PC"],
  },
  {
    id: "3",
    title: "Fantasy Realms",
    platforms: ["PlayStation 4", "PC"],
  },
];

const authors = [
  {
    id: "1001",
    name: "John Doe",
    verified: true,
  },
  {
    id: "1002",
    name: "Jane Smith",
    verified: false,
  },
  {
    id: "1003",
    name: "Alex Johnson",
    verified: true,
  },
];

export default { reviews, games, authors };
