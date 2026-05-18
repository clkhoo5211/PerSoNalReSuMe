import Giscus from '@giscus/react';

export default function GiscusComments({ term }) {
  return (
    <div className="giscus-wrap">
      <Giscus
        repo="clkhoo5211/PerSoNalReSuMe"
        repoId="REPO_ID_PLACEHOLDER"
        category="Comments"
        categoryId="CATEGORY_ID_PLACEHOLDER"
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
      <p className="giscus-setup-note">
        💡 To activate comments: enable GitHub Discussions on your repo, install the{' '}
        <a href="https://github.com/apps/giscus" target="_blank" rel="noopener noreferrer">Giscus app</a>,
        then update <code>repoId</code> and <code>categoryId</code> in{' '}
        <code>src/components/GiscusComments.jsx</code> using{' '}
        <a href="https://giscus.app" target="_blank" rel="noopener noreferrer">giscus.app</a>.
      </p>
    </div>
  );
}
