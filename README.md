# Cronjobz Monitor (GNOME Shell Extension)

This GNOME Shell extension shows the output of `cronjobz list` in the top bar.  
It was built for GNOME 45/46 using ESModules.

---

## Installation (replicating on another machine)

1. **Clone the repository**  
   ```bash
   git clone https://github.com/mnsosa/cronjobz-status-bar-extension.git
   ```

2. **Copy (or symlink) the folder to the GNOME extensions directory**  
   The extension folder name **must** match the UUID defined in `metadata.json` (`cron@status.jobz`).

   ```bash
   mkdir -p ~/.local/share/gnome-shell/extensions/
   cp -r cronjobz-monitor ~/.local/share/gnome-shell/extensions/cron@status.jobz
   ```

   Or, if you prefer a symlink (easier for development):
   ```bash
   ln -s ~/cronjobz-monitor ~/.local/share/gnome-shell/extensions/cron@status.jobz
   ```

3. **Restart GNOME Shell**  
   - On **Xorg**: press Alt+F2, type `r`, and press Enter.  
   - On **Wayland**: log out and log back in.

4. **Enable the extension**  
   ```bash
   gnome-extensions enable cron@status.jobz
   ```

---

## Development tips

- To check extension status:
  ```bash
  gnome-extensions info cron@status.jobz
  ```
- To see logs and errors:
  ```bash
  journalctl -f -o cat /usr/bin/gnome-shell | grep cron@status.jobz
  ```
- For quick debugging: open **Looking Glass** with Alt+F2, type `lg`.
