import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { chat } from '@/lib/llm'

export async function POST(request: NextRequest) {
  try {
    const { topic, language = 'en', research } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    const contextPath = path.join(process.cwd(), 'context')
    const readContext = async (file: string) => {
      try { return await fs.readFile(path.join(contextPath, file), 'utf-8') } catch { return '' }
    }

    const [brandVoice, features, writingExamples, seoGuidelines, internalLinks] = await Promise.all([
      readContext('brand-voice.md'),
      readContext('features.md'),
      readContext('writing-examples.md'),
      readContext('seo-guidelines.md'),
      readContext('internal-links-map.md'),
    ])

    const systemPrompt = `You are an expert SEO content writer. Write high-quality, comprehensive articles that rank on the first page of Google.

Requirements:
- Write in valid markdown format
- Include a compelling H1 title at the top
- Use H2 and H3 subheadings to structure the content clearly
- Write a meta title (≤60 chars) and meta description (150-160 chars) in a frontmatter-style block at the very top
- Do NOT use generic placeholders like [Benefit 1] — write actual, specific content
- Aim for 2,000–3,000 words unless guidelines specify otherwise
- Include a FAQ section near the end with 4-6 questions
- Use bullet points, numbered lists, and tables where appropriate
- End with a strong conclusion
- Output language: ${language}

${seoGuidelines ? `SEO Guidelines to follow:\n${seoGuidelines}` : ''}
${brandVoice ? `\nBrand voice to match:\n${brandVoice}` : ''}
${features ? `\nProduct/service context:\n${features}` : ''}
${writingExamples ? `\nWriting style examples to emulate:\n${writingExamples}` : ''}
${internalLinks ? `\nInternal linking opportunities (weave these in naturally where relevant):\n${internalLinks}` : ''}`

    const userPrompt = `Write a complete, publication-ready SEO article on: "${topic}"

${research ? `Use this research brief to inform the structure, keywords, and key points:\n\n${research}` : ''}

Date context: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}

Write the full article now. Do not truncate or summarize — produce the complete text.`

    const article = await chat(systemPrompt, userPrompt)

    const outputPath = path.join(process.cwd(), 'output')
    const filename = `${topic.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.md`

    try {
      await fs.mkdir(outputPath, { recursive: true })
      await fs.writeFile(path.join(outputPath, filename), article)
    } catch (e) {
      console.error('Error saving article:', e)
    }

    return NextResponse.json({ article, filename })
  } catch (error) {
    console.error('Write error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to write article' },
      { status: 500 }
    )
  }
}
