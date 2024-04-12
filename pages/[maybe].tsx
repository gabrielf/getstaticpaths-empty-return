import React from 'react'

export async function getStaticPaths() {
  // We don't always want this test page present
  if (process.env.MAYBE === 'false') {
    return {
      paths: [],
      fallback: false,
    }
  }

  return {
    paths: [{params: {maybe: 'maybe'}}],
    fallback: false,
  }
}

export async function getStaticProps() {
  return {
    props: {
      renderedAt: new Date().toISOString(),
    },
  }
}

export default function Maybe({renderedAt,}: { renderedAt: string }) {
  return (
    <main>
      <h1>Maybe</h1>
      <p>
        This page exist unless the env var <code>MAYBE</code> is set to <code>false</code>
      </p>
      <p>
        Rendered at: <code>{renderedAt}</code>
      </p>
    </main>
  )
}
