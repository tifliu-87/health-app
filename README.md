# tofu
A free, buildless health journal PWA. Workout sets/reps/weights and editable nutrition presets, daily goals, date-based history, local storage and JSON backups. No accounts, analytics, external fonts or paid APIs.

## Preview
Run `python3 -m http.server 8000` in this directory and open http://localhost:8000. Service workers require localhost or HTTPS.

## Publish
Push these files to the main branch of tifliu-87/health-app. In GitHub repository Settings → Pages → Build and deployment, select GitHub Actions. The Publish tofu workflow deploys to https://tifliu-87.github.io/health-app/.

## iPhone
Open the published URL in Safari, tap Share → Add to Home Screen → Add. Open once online to cache the app. Use the home screen app consistently; browser and installed app storage may differ. Export a backup from Settings regularly, and import it when moving devices. Records are stored only on the device, never in the repository. Editing/deleting presets does not change historical entries.

Default food values are approximate. Goals are user-editable placeholders, not personalized dietary advice.
