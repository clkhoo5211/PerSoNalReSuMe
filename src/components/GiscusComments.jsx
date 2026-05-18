import Giscus from '@giscus/react';

// ── Setup (one-time, ~2 min) ──────────────────────────────────────────────────
// 1. Go to github.com/clkhoo5211/PerSoNalReSuMe → Settings → Features → enable Discussions
// 2. Install the Giscus GitHub App: https://github.com/apps/giscus
// 3. Visit https://giscus.app, fill in your repo, copy repoId & categoryId below
// 4. Delete the SETUP_REQUIRED flag below to activate
// ─────────────────────────────────────────────────────────────────────────────
const REPO_ID       = 'REPO_ID_PLACEHOLDER';
const CATEGORY_ID   = 'CATEGORY_ID_PLACEHOLDER';
const SETUP_REQUIRED = REPO_ID === 'REPO_ID_PLACEHOLDER';

export default function GiscusComments({ term }) {
  if (SETUP_REQUIRED) {
    return (
      <div className="giscus-wrap">
        <div className="giscus-setup-note">
          <strong>💬 Comments not yet activated.</strong> To enable:
          <ol style={{ marginTop: 8, paddingLeft: 20, lineHeight: 2 }}>
            <li>Go to your repo → <strong>Settings → Features</strong> → enable <strong>Discussions</strong></li>
            <li>Install the <a href="https://github.com/apps/giscus" target="_blank" rel="noopener noreferrer">Giscus GitHub App</a> on your repo</li>
            <li>Visit <a href="https://giscus.app" target="_blank" rel="noopener noreferrer">giscus.app</a>, enter <code>clkhoo5211/PerSoNalReSuMe</code>, copy the <code>repoId</code> and <code>categoryId</code></li>
            <li>Paste them into <code>src/components/GiscusComments.jsx</code> and redeploy</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="giscus-wrap">
      <Giscus
        repo="clkhoo5211/PerSoNalReSuMe"
        repoId={REPO_ID}
        category="Comments"
        categoryId={CATEGORY_ID}
        mapping="specific"
        term={term}
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="dark"
        lang="en"
        loading="lazy"
      />
    </div>
  );
}
