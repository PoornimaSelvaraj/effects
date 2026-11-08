
import React, { useEffect, useRef, useState } from "react";

const getImage = (name) => `${import.meta.env.BASE_URL}${name}`;

const TRACKS = [
  {
    title: "Thanga Poove",
    artist: "Melody Songs",
    time: "3:15",
    color: "#b985ff",
    img: getImage("thangapoove.jpg"),
    art: "linear-gradient(145deg,#ff62dc,#6a2cff,#1b1050)",
    specs: [
      ["File Format", "MP3 / AAC"],
      ["Bitrate", "320 kbps HD"],
      ["Sample Rate", "44.1 kHz"],
      ["File Size", "7.4 MB"],
      ["Key / Tempo", "D Minor / 96 BPM"]
    ]
  },
  {
    title: "Mersal",
    artist: "Tamil Hits",
    time: "3:42",
    color: "#6ee7c8",
    img: getImage("mersal.jpg"),
    art: "linear-gradient(145deg,#ec70c4,#54216f,#160d36)",
    specs: [
      ["File Format", "MP3 / ALAC"],
      ["Bitrate", "320 kbps HD"],
      ["Sample Rate", "48.0 kHz"],
      ["File Size", "8.5 MB"],
      ["Key / Tempo", "E Minor / 128 BPM"]
    ]
  },
  {
    title: "Jana Nayagan",
    artist: "Latest Hits",
    time: "2:58",
    color: "#ffd23f",
    img: getImage("jananayagan.jpg"),
    art: "linear-gradient(145deg,#ffbd52,#b52a12,#350b08)",
    specs: [
      ["File Format", "MP3 / AAC"],
      ["Bitrate", "256 kbps"],
      ["Sample Rate", "44.1 kHz"],
      ["File Size", "5.9 MB"],
      ["Key / Tempo", "A Minor / 110 BPM"]
    ]
  }
];

const SEQUENCE = [
  { track: 0, showInfo: false },
  { track: 0, showInfo: true },
  { track: 1, showInfo: false },
  { track: 1, showInfo: true },
  { track: 2, showInfo: false },
  { track: 2, showInfo: true }
];

const STEP_MS = 3400;

function Art({ track }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [track.img]);

  return (
    <div className="art" style={{ background: track.art }}>
      {!failed && (
        <img
          src={track.img}
          alt={track.title}
          onError={() => setFailed(true)}
          draggable="false"
        />
      )}
      <strong>{track.title}</strong>
    </div>
  );
}

export default function App() {
  const stageRef = useRef(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStep((s) => (s + 1) % SEQUENCE.length);
    }, STEP_MS);

    return () => clearInterval(id);
  }, []);

  const { track: current, showInfo } = SEQUENCE[step];
  const song = TRACKS[current];

  const move = (e) => {
    const el = stageRef.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;

    el.style.setProperty("--rx", `${(0.5 - y) * 6}deg`);
    el.style.setProperty("--ry", `${(x - 0.5) * 10}deg`);
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
  };

  const reset = () => {
    const el = stageRef.current;
    if (!el) return;

    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--mx", "50%");
    el.style.setProperty("--my", "50%");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Source+Serif+4:wght@700&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          margin: 0;
          background: #ed1019;
        }

        .gaana-page {
          min-height: 100vh;
          width: 100%;
          overflow: hidden;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(
            ellipse at 50% 48%,
            #ff3029 0%,
            #f01820 55%,
            #bd0010 100%
          );
          color: white;
          font-family: 'Outfit', sans-serif;
        }

        .gaana-logo {
          position: absolute;
          top: 7%;
          font-family: 'Source Serif 4', serif;
          font-size: clamp(30px, 4vw, 43px);
          letter-spacing: -2px;
          font-weight: 700;
          z-index: 10;
          text-shadow: 0 4px 15px rgba(50,0,0,.25);
        }

        .gaana-logo span {
          color: #8c0010;
        }

        .gaana-stage {
          width: min(1050px, 94%);
          display: grid;
          grid-template-columns: 1fr 1.1fr 1fr;
          align-items: center;
          gap: clamp(18px, 4vw, 48px);
          perspective: 1400px;
          transform-style: preserve-3d;
          transform: rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
          transition: transform .2s ease-out;
        }

        .flip-wrap {
          perspective: 1100px;
          width: 100%;
          aspect-ratio: 1.08;
          min-height: 170px;
        }

        .flip-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 1s cubic-bezier(.65,.05,.25,1);
        }

        .flip-inner.flipped {
          transform: rotateY(180deg);
        }

        .right-wrap .flip-inner {
          transition-delay: .35s;
        }

        .face {
          position: absolute;
          inset: 0;
          border: 1px solid rgba(255,255,255,.28);
          border-radius: 10px;
          background: linear-gradient(
            145deg,
            rgba(255,255,255,.26),
            rgba(255,255,255,.09)
          );
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          box-shadow:
            0 12px 35px rgba(80,0,0,.2),
            inset 0 1px 0 rgba(255,255,255,.3);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 9px;
          padding: 12px;
        }

        .face.back {
          transform: rotateY(180deg);
        }

        .art {
          position: relative;
          width: 88%;
          aspect-ratio: 1.25;
          border-radius: 6px;
          overflow: hidden;
          box-shadow: 0 6px 18px rgba(0,0,0,.35);
          display: flex;
          align-items: flex-end;
          padding: 8px;
        }

        .art img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        .art::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0,0,0,.55),
            transparent 55%
          );
        }

        .art strong {
          position: relative;
          z-index: 2;
          font-size: clamp(10px, 1.3vw, 14px);
          text-shadow: 0 2px 8px black;
        }

        .panel-title {
          font-size: clamp(11px, 1.3vw, 15px);
          font-weight: 700;
        }

        .panel-hint {
          font-size: 8px;
          letter-spacing: .8px;
          color: rgba(255,255,255,.75);
          text-align: center;
        }

        .info-list {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 7px;
          padding: 0 6px;
        }

        .info-heading {
          font-size: clamp(9px, 1.1vw, 12px);
          font-weight: 800;
          letter-spacing: 1px;
          text-align: center;
        }

        .info-sub {
          font-size: 8px;
          letter-spacing: 1px;
          color: rgba(255,255,255,.7);
          text-align: center;
          margin-bottom: 4px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          gap: 6px;
          font-size: clamp(7px, .85vw, 10px);
          border-bottom: 1px solid rgba(255,255,255,.18);
          padding-bottom: 4px;
        }

        .info-row span:first-child {
          color: rgba(255,255,255,.8);
        }

        .info-row span:last-child {
          font-weight: 700;
          text-align: right;
        }

        .audio-icon {
          font-size: 28px;
        }

        .center-area {
          position: relative;
          width: 100%;
          aspect-ratio: 1.08;
          perspective: 1200px;
          transform-style: preserve-3d;
        }

        .center-glow {
          position: absolute;
          width: 75%;
          height: 30%;
          bottom: 8%;
          left: 12%;
          border-radius: 50%;
          background: rgba(60,0,0,.45);
          filter: blur(25px);
        }

        .folder-back {
          position: absolute;
          left: 10%;
          width: 80%;
          top: 40%;
          height: 44%;
          border: 2px solid rgba(255,255,255,.9);
          border-radius: 8px;
          background: linear-gradient(145deg,#2a2025,#0b0709 75%);
          box-shadow: 0 16px 30px rgba(0,0,0,.45);
          z-index: 1;
        }

        .folder-back::before {
          content: "";
          position: absolute;
          top: -9%;
          right: 8%;
          width: 34%;
          height: 12%;
          border: 2px solid rgba(255,255,255,.9);
          border-bottom: none;
          border-radius: 6px 6px 0 0;
          background: #1b1418;
        }

        .folder-front {
          position: absolute;
          left: 10%;
          width: 80%;
          top: 48%;
          height: 36%;
          border: 2px solid rgba(255,255,255,.95);
          border-radius: 7px;
          background: linear-gradient(145deg,#2b2428,#0a0709);
          box-shadow:
            0 8px 20px rgba(0,0,0,.4),
            inset 0 1px 2px rgba(255,255,255,.25);
          z-index: 5;
          transform-origin: 50% 100%;
          transform: rotateX(0deg);
          transition: transform .9s cubic-bezier(.65,.05,.25,1);
          display: flex;
          align-items: flex-start;
          padding: 8px 12px;
        }

        .folder-front.open {
          transform: rotateX(-28deg);
        }

        .folder-logo {
          font-family: 'Source Serif 4', serif;
          font-size: clamp(11px, 1.6vw, 17px);
          font-weight: 700;
          letter-spacing: -1px;
          padding: 2px 8px;
          border: 1.5px solid rgba(255,255,255,.7);
          border-radius: 20px;
        }

        .folder-logo span {
          color: #ff3b47;
        }

        .card-deck {
          position: absolute;
          inset: 0;
          z-index: 3;
        }

        .music-card {
          position: absolute;
          left: 36.5%;
          width: 27%;
          top: 22%;
          height: 44%;
          padding: 8px 6px;
          border: 1.5px solid rgba(255,255,255,.6);
          border-radius: 8px;
          background: linear-gradient(160deg,#25232a,#08080b 80%);
          box-shadow: 0 10px 22px rgba(0,0,0,.45);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          color: white;
          opacity: 0;
          transform: translate(0,45%) scale(.7);
          transform-origin: 50% 100%;
          transition:
            transform .9s cubic-bezier(.34,1.3,.5,1),
            opacity .5s ease,
            border-color .4s,
            box-shadow .4s;
        }

        .music-card:nth-child(1) {
          z-index: 3;
          --fx: -92%;
          --fy: -22%;
          --fr: -20deg;
          transition-delay: .05s;
        }

        .music-card:nth-child(2) {
          z-index: 4;
          --fx: 0%;
          --fy: -42%;
          --fr: 0deg;
          transition-delay: .15s;
        }

        .music-card:nth-child(3) {
          z-index: 2;
          --fx: 92%;
          --fy: -22%;
          --fr: 20deg;
          transition-delay: .25s;
        }

        .deck-open .music-card {
          opacity: 1;
          transform: translate(var(--fx),var(--fy)) scale(1) rotate(var(--fr));
        }

        .deck-open .music-card.active {
          border-color: var(--accent);
          box-shadow:
            0 0 16px var(--accent),
            0 10px 25px rgba(0,0,0,.45);
        }

        /* Actual song images inside the center cards */

        .card-art {
          width: 85%;
          height: 55%;
          margin-top: 5%;
          border-radius: 6px;
          overflow: hidden;
          background-size: cover;
          background-position: center;
          border: 1px solid rgba(255,255,255,.35);
          box-shadow: 0 5px 15px rgba(0,0,0,.4);
          flex-shrink: 0;
        }

        .card-art img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          object-position: center;
        }

        .card-text {
          text-align: center;
          width: 100%;
        }

        .card-title {
          font-size: clamp(7px, .95vw, 11px);
          font-weight: 700;
        }

        .card-time {
          font-size: clamp(6px, .8vw, 9px);
          color: rgba(255,255,255,.65);
          margin-top: 2px;
        }

        .card-ctrl {
          font-size: 8px;
          letter-spacing: 5px;
          color: rgba(255,255,255,.8);
          padding-bottom: 2px;
        }

        .shine {
          position: absolute;
          inset: -5%;
          z-index: 8;
          pointer-events: none;
          background: radial-gradient(
            circle at var(--mx,50%) var(--my,50%),
            rgba(255,255,255,.15),
            transparent 45%
          );
        }

        @media (max-width: 750px) {
          .gaana-page {
            padding: 100px 20px 40px;
          }

          .gaana-logo {
            top: 30px;
          }

          .gaana-stage {
            grid-template-columns: 1fr;
            max-width: 340px;
            gap: 22px;
          }

          .center-area {
            grid-row: 1;
            max-width: 320px;
            margin: auto;
          }

          .left-wrap {
            grid-row: 2;
            max-width: 300px;
            margin: auto;
          }

          .right-wrap {
            grid-row: 3;
            max-width: 300px;
            margin: auto;
          }

          .flip-wrap {
            min-height: 230px;
          }

          .panel-title {
            font-size: 15px;
          }

          .panel-hint {
            font-size: 9px;
          }

          .info-row {
            font-size: 10px;
          }

          .info-heading {
            font-size: 12px;
          }

          .card-title {
            font-size: 9px;
          }

          .card-time {
            font-size: 8px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .flip-inner,
          .folder-front,
          .music-card {
            transition-duration: .01s;
            transition-delay: 0s;
          }
        }
      `}</style>

      <div className="gaana-page">
        <h1 className="gaana-logo">
          <span>g</span>aana
        </h1>

        <main
          className="gaana-stage"
          ref={stageRef}
          onPointerMove={move}
          onPointerLeave={reset}
        >
          {/* LEFT FLIP PANEL */}

          <div className="flip-wrap left-wrap">
            <div className={`flip-inner ${showInfo ? "flipped" : ""}`}>
              <div className="face front">
                <Art track={song} />

                <h2 className="panel-title">Track Media</h2>

                <p className="panel-hint">
                  {song.artist} • {song.time}
                </p>
              </div>

              <div className="face back">
                <div className="info-list">
                  <div className="info-heading">TRACK INFO</div>

                  <div className="info-sub">{song.title}</div>

                  {[
                    ["Song", song.title],
                    ["Artist", song.artist],
                    ["Duration", song.time]
                  ].map(([k, v]) => (
                    <div className="info-row" key={k}>
                      <span>{k}</span>
                      <span>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CENTER FOLDER AND MUSIC CARDS */}

          <div className="center-area">
            <div className="center-glow" />

            <div className="folder-back" />

            <div className={`card-deck ${showInfo ? "deck-open" : ""}`}>
              {TRACKS.map((t, i) => (
                <div
                  key={t.title}
                  className={`music-card ${current === i ? "active" : ""}`}
                  style={{ "--accent": t.color }}
                >
                  <div className="card-art" style={{ background: t.art }}>
                    <img
                      src={t.img}
                      alt={t.title}
                      draggable="false"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>

                  <div className="card-text">
                    <div className="card-title">{t.title}</div>
                    <div className="card-time">{t.time}</div>
                  </div>

                  <div className="card-ctrl">◀ Ⅱ ▶</div>
                </div>
              ))}
            </div>

            <div className={`folder-front ${showInfo ? "open" : ""}`}>
              <div className="folder-logo">
                <span>g</span>aana
              </div>
            </div>

            <div className="shine" />
          </div>

          {/* RIGHT FLIP PANEL */}

          <div className="flip-wrap right-wrap">
            <div className={`flip-inner ${showInfo ? "flipped" : ""}`}>
              <div className="face front">
                <div className="audio-icon">♫</div>

                <h2 className="panel-title">Audio Profile</h2>

                <p className="panel-hint">
                  MUSIC • SOUND • EXPERIENCE
                </p>
              </div>

              <div className="face back">
                <div className="info-list">
                  <div className="info-heading">AUDIO PROFILE</div>

                  <div className="info-sub">SOUND SPECS</div>

                  {song.specs.map(([k, v]) => (
                    <div className="info-row" key={k}>
                      <span>{k}</span>
                      <span>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
