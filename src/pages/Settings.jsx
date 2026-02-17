import "../styles/settings.css";


function Settings() {
  return (
    <div>
      <h2>Settings</h2>

      {/* Profile Settings */}
      <div className="settings-card">
        <h3>Profile Settings</h3>
        <label>Email</label>
        <input type="text" placeholder="Enter email" />
      </div>

      {/* Password Settings */}
      <div className="settings-card">
        <h3>Change Password</h3>
        <label>New Password</label>
        <input type="password" placeholder="Enter new password" />
      </div>

      {/* Theme Settings */}
      <div className="settings-card">
        <h3>Theme</h3>
        <select>
          <option>Dark</option>
          <option>Light</option>
        </select>
      </div>
    </div>
  );
}

export default Settings;
