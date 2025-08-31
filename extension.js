// GNOME Shell 45/46 (ESModules)
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import St from 'gi://St';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

const SIMULATE = true; 

export default class CronjobzMonitorExtension {
    constructor() {
        this._button = null;
        this._menuItems = [];
        this._timeout = null;
        this._updating = false;
    }

    enable() {
    console.log('[cronjobz] enable()');
    this._button = new PanelMenu.Button(0.0, 'CronjobzMonitor');

    // Ruta absoluta a tu logo
    const iconPath = `${GLib.get_home_dir()}/.local/share/gnome-shell/extensions/cron@status.jobz/icons/logo.png`;

    const icon = new St.Icon({
        gicon: Gio.icon_new_for_string(iconPath),
        style_class: 'system-status-icon'
    });

    this._button.add_child(icon);
    Main.panel.addToStatusArea('cronjobz-monitor', this._button, 0, 'right');

    this._updateMenu();
    this._timeout = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 60, () => {
        this._updateMenu();
        return GLib.SOURCE_CONTINUE;
    });
}

    disable() {
        console.log('[cronjobz] disable()');
        if (this._timeout) {
            GLib.source_remove(this._timeout);
            this._timeout = null;
        }
        this._clearMenu();
        this._button?.destroy();
        this._button = null;
    }

    async _runCronjobzList() {
        if (SIMULATE) {
            return [
                'Recent job runs (last 2):',
                '✅ demo2 (40.0s) - sleep 40',
                "✅ demo (0.0s) - echo 'holaa'"
            ].join('\n');
        }

        // TODO: not simulation
        return '';
    }

    async _updateMenu() {
        if (!this._button || this._updating) return;

        this._updating = true;
        try {
            this._clearMenu();
            const loading = new PopupMenu.PopupMenuItem('Cargando…');
            loading.setSensitive(false);
            this._button.menu.addMenuItem(loading);
            this._menuItems.push(loading);

            const output = await this._runCronjobzList();

            this._clearMenu();
            const lines = String(output || '').split('\n').map(s => s.trim()).filter(Boolean);

            if (lines.length === 0) {
                const item = new PopupMenu.PopupMenuItem('No hay datos de cronjobz');
                item.setSensitive(false);
                this._button.menu.addMenuItem(item);
                this._menuItems.push(item);
            } else {
                for (const line of lines) {
                    const item = new PopupMenu.PopupMenuItem(line);
                    this._button.menu.addMenuItem(item);
                    this._menuItems.push(item);
                }
            }
        } catch (e) {
            console.error('[cronjobz] update error:', e?.message || e);
        } finally {
            this._updating = false;
        }
    }

    _clearMenu() {
        for (const it of this._menuItems) it.destroy();
        this._menuItems = [];
    }
}
