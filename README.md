# IronLog

A private workout tracker that installs to your phone's home screen and works offline.
All data stays on your device.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The whole app (HTML, CSS, JavaScript in one file) |
| `manifest.json` | Tells the phone the app name, icon, and colours |
| `service-worker.js` | Makes the app work with no internet |
| `icon-*.png` | Home screen icons |

Keep all files together in the same folder. Do not rename `index.html`.

## Putting it online with GitHub Pages

You need the app on an `https://` address before a phone will install it.
GitHub Pages does this for free. No software to install, all in the browser.

1. Go to https://github.com and sign in.
2. Click the **+** in the top right, then **New repository**.
3. Name it `ironlog`. Set it to **Public**. Do not tick "Add a README file". Click **Create repository**.
4. On the next page click the **uploading an existing file** link.
5. Drag in all 7 files from this folder. Drag the files themselves, not the folder.
6. Click **Commit changes**.
7. Go to the **Settings** tab, then **Pages** in the left sidebar.
8. Under "Build and deployment", set Source to **Deploy from a branch**, branch to **main**, folder to **/ (root)**. Click **Save**.
9. Wait one or two minutes, then reload the page. Your address appears at the top:
   `https://YOUR-USERNAME.github.io/ironlog/`

## Installing on your phone

Open your GitHub Pages address on your phone, then:

**Android (Chrome)** — an Install banner appears at the top of the app. Tap **Install**.
If it does not appear, use the browser menu and choose **Install app** or **Add to Home screen**.

**iPhone (Safari)** — tap the **Share** button at the bottom of the screen, scroll down,
tap **Add to Home Screen**, then **Add**. Safari is required; this does not work in Chrome on iPhone.

The app now has its own icon, opens full screen with no address bar, and works without internet.

## Updating the app later

Edit `index.html` on GitHub (open the file, click the pencil icon, commit), or upload a new
copy with **Add file > Upload files**. Also change the version number at the top of
`service-worker.js` (for example `ironlog-cache-v5` to `ironlog-cache-v6`), otherwise phones
keep showing the old cached version. Close and reopen the app twice to pick up the update.

## Backing up your data

Your training history is stored on the phone only. It is lost if you clear browsing data,
delete the app, or lose the phone.

In the **Profile** tab, tap **Save backup file** now and then and keep the file somewhere safe.
To move to a new phone: install the app there, then use **Restore from file**.
