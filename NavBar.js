import "../css/NavBar.css";

function NavBar({ user, onLogout }) {
  if (!user) return null;

  const displayName = user.name || user.email || "User";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <nav className="navbar">
      <div className="navbar-brand">Library</div>

      <div className="navbar-user">
        <div className="user-info">
          <div className="user-avatar">{avatarLetter}</div>
          <span className="navbar-hello">
            Hello, {displayName}
          </span>
        </div>

        <button className="logout-btn" onClick={onLogout}>
          Log Out
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
