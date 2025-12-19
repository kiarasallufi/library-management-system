import "../css/AdminInsights.css";

function AdminInsights({ books }) {
  if (!books.length) return <div className="insights-box">No data yet</div>;

  // Total books
  const totalBooks = books.length;

  // Most read genre
  const genreCount = {};
  books.forEach(b => {
    genreCount[b.genre] = (genreCount[b.genre] || 0) + 1;
  });
  const mostReadGenre = Object.entries(genreCount).sort((a,b)=>b[1]-a[1])[0];

  // Reading status counts
  const reading = books.filter(b => b.status === "reading").length;
  const completed = books.filter(b => b.status === "completed").length;
  const planned = books.filter(b => b.status === "planned").length;

  // User with most books
  const userMap = {};
  books.forEach(b => {
    userMap[b.user_name] = (userMap[b.user_name] || 0) + 1;
  });
  const topUser = Object.entries(userMap).sort((a,b)=>b[1]-a[1])[0];

  return (
    <div className="insights-box">
      <h3>📊 Library Insights</h3>

      <p><b>Total Books:</b> {totalBooks}</p>

      <p>
        <b>Most Read Genre:</b>{" "}
        {mostReadGenre ? `${mostReadGenre[0]} (${mostReadGenre[1]} books)` : "N/A"}
      </p>

      <p><b>Status Overview:</b></p>
      <ul>
        <li>Reading: {reading}</li>
        <li>Completed: {completed}</li>
        <li>Planned: {planned}</li>
      </ul>

      <p>
        <b>User With Most Books:</b>{" "}
        {topUser ? `${topUser[0]} (${topUser[1]} books)` : "N/A"}
      </p>
    </div>
  );
}

export default AdminInsights;
