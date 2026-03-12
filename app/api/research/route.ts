import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { chat } from '@/lib/llm'

export async function POST(request: NextRequest) {
  try {
    const { topic, language = 'en' } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    const contextPath = path.join(process.cwd(), 'context')
    const readContext = async (file: string) => {
      try { return await fs.readFile(path.join(contextPath, file), 'utf-8') } catch { return '' }
    }

    const [brandVoice, features, targetKeywords, seoGuidelines, competitors] = await Promise.all([
      readContext('brand-voice.md'),
      readContext('features.md'),
      readContext('target-keywords.md'),
      readContext('seo-guidelines.md'),
      readContext('competitor-analysis.md'),
    ])

    const systemPrompt = `You are an expert SEO researcher and content strategist. Produce detailed, actionable research briefs that guide a content writer to create a top-ranking article.

Output a thorough markdown research brief covering:
1. Primary and secondary keyword clusters (specific phrases, not generic)
2. Search intent analysis (informational / commercial / transactional / navigational)
3. Competitor content analysis — topics covered, word count benchmarks, content gaps
4. Recommended article structure (H1, H2s, H3s with proposed headings)
5. Key questions to answer (People Also Ask style)
6. Meta title options (under 60 chars, include year) and meta description options (150-160 chars)
7. Internal linking opportunities
8. Estimated word count target
9. Tone and angle recommendations

Be specific and actionable. Do not use placeholders. Language for the output: ${language}`

    const contextSection = [
      brandVoice && `## Brand Voice\n${brandVoice}`,
      features && `## Product/Service Features\n${features}`,
      targetKeywords && `## Existing Target Keywords\n${targetKeywords}`,
      seoGuidelines && `## SEO Guidelines\n${seoGuidelines}`,
      competitors && `## Competitor Analysis Context\n${competitors}`,
    ].filter(Boolean).join('\n\n---\n\n')

    const userPrompt = `Create a comprehensive SEO research brief for the topic: "${topic}"

${contextSection ? `Use this brand context to make recommendations relevant to our specific audience:\n\n${contextSection}` : ''}

Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`

    const researchBrief = await chat(systemPrompt, userPrompt)

    const researchPath = path.join(process.cwd(), 'research')
    const filename = `brief-${topic.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.md`

    try {
      await fs.mkdir(researchPath, { recursive: true })
      await fs.writeFile(path.join(researchPath, filename), researchBrief)
    } catch (e) {
      console.error('Error saving research brief:', e)
    }

    return NextResponse.json({ brief: researchBrief, filename })
  } catch (error) {
    console.error('Research error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to perform research' },
      { status: 500 }
    )
  }
}
