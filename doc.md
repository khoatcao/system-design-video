npm run generate:voice -- system-design 

for f in public/audio/microservices-communication/*.mp3; do
  echo -n "$(basename "$f") "
  ffprobe -v error \
    -show_entries format=duration \
    -of default=noprint_wrappers=1:nokey=1 "$f"
done

The order is now:

✅ content/microservices-communication.ts
✅ Generate voice
✅ Get real audio durations
✅ src/Composition.tsx
✅ src/timeline.ts
➡️ src/scenes/MicroservicesCommunicationScene.tsx ← NEXT
Run npm run dev
Check the animation in Remotion
Fix visual timing/layout if needed
Render the final Reel