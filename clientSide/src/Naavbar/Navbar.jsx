import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        {user && (
          <>
            <img src={user.profilepicture} alt="Profile" className="profile-picture" />
          </>
        )}
      </div>
      <button className="logout-button" onClick={onLogout}>Logout</button>
    </nav>
  );
};



export default Navbar;
