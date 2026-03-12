import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { chat } from '@/lib/llm'

export async function POST(request: NextRequest) {
  try {
    const { url, topic, language = 'en', instructions, existingContent } = await request.json()

    if (!url && !topic && !existingContent) {
      return NextResponse.json({ error: 'Provide a URL, topic, or existing content to rewrite' }, { status: 400 })
    }

    const contextPath = path.join(process.cwd(), 'context')
    const readContext = async (file: string) => {
      try { return await fs.readFile(path.join(contextPath, file), 'utf-8') } catch { return '' }
    }

    const [brandVoice, seoGuidelines, styleGuide, internalLinks] = await Promise.all([
      readContext('brand-voice.md'),
      readContext('seo-guidelines.md'),
      readContext('style-guide.md'),
      readContext('internal-links-map.md'),
    ])

    const systemPrompt = `You are an expert SEO content editor and rewriter. Your job is to take existing content and transform it into a high-quality, up-to-date, well-optimized article.

When rewriting:
- Preserve the core subject matter and key information
- Significantly improve structure, clarity, and readability
- Update any outdated statistics or claims with the note "[verify stat]" where you can't confirm current data
- Optimize for SEO: improve the H1, add/restructure H2s and H3s, improve keyword usage naturally
- Write a new meta title (≤60 chars) and meta description (150-160 chars) at the top
- Add or improve a FAQ section with 4-6 questions
- Do NOT use placeholders like [Updated stat 1] — write real, specific content
- Output language: ${language}

${seoGuidelines ? `SEO Guidelines:\n${seoGuidelines}` : ''}
${brandVoice ? `\nBrand voice:\n${brandVoice}` : ''}
${styleGuide ? `\nStyle guide:\n${styleGuide}` : ''}
${internalLinks ? `\nInternal linking opportunities:\n${internalLinks}` : ''}`

    const contentBlock = existingContent
      ? `Here is the existing content to rewrite:\n\n${existingContent}`
      : url
      ? `The original article is at: ${url}\n\nRewrite this as a fresh, improved version of that article — inferring the likely structure and content from the URL and topic.`
      : `Rewrite/create a new comprehensive article on this topic.`

    const userPrompt = `${contentBlock}

Topic: ${topic || url || 'General rewrite'}
${instructions ? `\nSpecific instructions: ${instructions}` : ''}

Date context: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}

Produce the complete, fully rewritten article now.`

    const rewrite = await chat(systemPrompt, userPrompt)

    const rewritesPath = path.join(process.cwd(), 'rewrites')
    const slug = (topic || url || 'rewrite').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const filename = `${slug}-rewrite-${new Date().toISOString().split('T')[0]}.md`

    try {
      await fs.mkdir(rewritesPath, { recursive: true })
      await fs.writeFile(path.join(rewritesPath, filename), rewrite)
    } catch (e) {
      console.error('Error saving rewrite:', e)
    }

    return NextResponse.json({ rewrite, filename })
  } catch (error) {
    console.error('Rewrite error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to rewrite content' },
      { status: 500 }
    )
  }
}
