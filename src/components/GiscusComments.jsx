import Giscus from '@giscus/react';

const REPO_ID     = 'R_kgDOSg6XlQ';
const CATEGORY_ID = 'DIC_kwDOSg6Xlc4C9Uu4';

export default function GiscusComments({ term, theme = 'preferred_color_scheme' }) {
  return (
    <div className="giscus-wrap">
      <Giscus
        repo="clkhoo5211/PerSoNalReSuMe"
        repoId={REPO_ID}
        category="Q&A"
        categoryId={CATEGORY_ID}
        mapping="pathname"
        term={term}
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme={theme}
        lang="en"
        loading="lazy"
        crossOrigin="anonymous"
      />
    </div>
  );
}
