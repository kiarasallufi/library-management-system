function AIRecommendations({ books, user }) {
  if (!books || !books.length)
    return (
      <div className="insights-box">
        <h3>🤖 AI Recommendations</h3>
        <p>No books available to analyze yet.</p>
      </div>
    );

  // Books of logged user
  const userBooks = books.filter(b => b.user_id === user.id);

  if (!userBooks.length)
    return (
      <div className="insights-box">
        <h3>🤖 AI Recommendations</h3>
        <p>User has no reading history yet.</p>
      </div>
    );

  // Find favorite genre
  const genreCount = {};
  userBooks.forEach(b => {
    if (!genreCount[b.genre]) genreCount[b.genre] = 0;
    genreCount[b.genre]++;
  });

  const favoriteGenre = Object.entries(genreCount)
    .sort((a, b) => b[1] - a[1])[0]?.[0];

  // Recommendations from other users same genre
  const recommendations = books.filter(
    b => b.genre === favoriteGenre && b.user_id !== user.id
  );

  return (
    <div className="insights-box">
      <h3>🤖 AI Recommendations</h3>

      <p>
        Based on your reading history, your preferred genre is:
        <b> {favoriteGenre}</b>
      </p>

      {recommendations.length ? (
        <>
          <p>Suggested books from other users:</p>
          <ul>
            {recommendations.map(b => (
              <li key={b.id}>
                <b>{b.title}</b> — {b.author} ({b.user_name})
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>No recommendations found yet. Keep reading! 📚</p>
      )}
    </div>
  );
}

export default AIRecommendations;
