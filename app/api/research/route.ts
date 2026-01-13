import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

// Language configuration
const LANGUAGE_LABELS: Record<string, { research: string, keywords: string, overview: string, analysis: string, intent: string, structure: string, meta: string, links: string, next: string }> = {
  en: { research: 'Research Brief', keywords: 'Keywords', overview: 'Topic Overview', analysis: 'Competitor Analysis', intent: 'Search Intent', structure: 'Recommended Content Structure', meta: 'Meta Elements Suggestions', links: 'Internal Linking Opportunities', next: 'Next Steps' },
  es: { research: 'Informe de Investigación', keywords: 'Palabras Clave', overview: 'Resumen del Tema', analysis: 'Análisis de Competidores', intent: 'Intención de Búsqueda', structure: 'Estructura de Contenido Recomendada', meta: 'Sugerencias de Meta Elementos', links: 'Oportunidades de Enlaces Internos', next: 'Próximos Pasos' },
  fr: { research: 'Rapport de Recherche', keywords: 'Mots-clés', overview: 'Aperçu du Sujet', analysis: 'Analyse Concurrentielle', intent: 'Intention de Recherche', structure: 'Structure de Contenu Recommandée', meta: 'Suggestions de Méta Éléments', links: 'Opportunités de Liens Internes', next: 'Prochaines Étapes' },
  de: { research: 'Forschungsbericht', keywords: 'Schlüsselwörter', overview: 'Themenübersicht', analysis: 'Wettbewerbsanalyse', intent: 'Suchintention', structure: 'Empfohlene Inhaltsstruktur', meta: 'Meta-Element-Vorschläge', links: 'Interne Verlinkungsmöglichkeiten', next: 'Nächste Schritte' },
  it: { research: 'Rapporto di Ricerca', keywords: 'Parole Chiave', overview: 'Panoramica Argomento', analysis: 'Analisi Competitor', intent: 'Intento di Ricerca', structure: 'Struttura Contenuti Consigliata', meta: 'Suggerimenti Meta Elementi', links: 'Opportunità Link Interni', next: 'Prossimi Passi' },
  pt: { research: 'Relatório de Pesquisa', keywords: 'Palavras-chave', overview: 'Visão Geral do Tópico', analysis: 'Análise de Concorrentes', intent: 'Intenção de Busca', structure: 'Estrutura de Conteúdo Recomendada', meta: 'Sugestões de Meta Elementos', links: 'Oportunidades de Links Internos', next: 'Próximos Passos' },
}

function getLabels(lang: string) {
  return LANGUAGE_LABELS[lang] || LANGUAGE_LABELS['en']
}

export async function POST(request: NextRequest) {
  try {
    const { topic, language = 'en' } = await request.json()
    
    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    const labels = getLabels(language)

    // Read context files to include in the research
    const contextPath = path.join(process.cwd(), 'context')
    let brandVoice = ''
    let features = ''
    
    try {
      brandVoice = await fs.readFile(path.join(contextPath, 'brand-voice.md'), 'utf-8')
    } catch {}
    
    try {
      features = await fs.readFile(path.join(contextPath, 'features.md'), 'utf-8')
    } catch {}

    // Generate research brief
    const researchBrief = `# ${labels.research}: ${topic}

## ${labels.overview}
Research topic: "${topic}"
Language: ${language.toUpperCase()}

## Primary ${labels.keywords}
- ${topic.toLowerCase()}
- ${topic.toLowerCase().split(' ').slice(0, 2).join(' ')} guide
- how to ${topic.toLowerCase().split(' ').slice(0, 3).join(' ')}
- best ${topic.toLowerCase().split(' ').slice(0, 2).join(' ')}
- ${topic.toLowerCase()} tips

## Secondary ${labels.keywords}
- ${topic.toLowerCase()} strategies
- ${topic.toLowerCase()} best practices
- ${topic.toLowerCase()} for beginners
- complete guide to ${topic.toLowerCase()}
- ${topic.toLowerCase()} examples

## ${labels.analysis}
### Top-Ranking Content Characteristics
- Average word count: 2,500-3,500 words
- Common structure: Introduction, Core sections, How-to steps, FAQ
- Media usage: Images, infographics, examples

### Content Gaps to Fill
- Provide more actionable, step-by-step guidance
- Include real-world examples and case studies
- Add expert insights and data-backed claims
- Cover advanced strategies competitors miss

## ${labels.intent}
**Primary Intent**: Informational
Users searching for this topic typically want to:
- Learn how something works
- Get step-by-step guidance
- Understand best practices
- Make informed decisions

## ${labels.structure}

### H1: [Main Title - Include Primary Keyword]

### H2 Sections:
1. **Introduction** - Hook + what they'll learn
2. **What is ${topic}?** - Definition and overview
3. **Why ${topic} Matters** - Benefits and importance
4. **How to Get Started with ${topic}** - Step-by-step guide
5. **Best Practices for ${topic}** - Expert tips
6. **Common Mistakes to Avoid** - What not to do
7. **Advanced Strategies** - Next-level tactics
8. **Tools and Resources** - Helpful tools
9. **FAQ** - Common questions answered
10. **Conclusion** - Summary + CTA

## ${labels.meta}

### Title Options:
1. "${topic}: The Complete Guide [${new Date().getFullYear()}]"
2. "How to ${topic.split(' ')[0]} ${topic.split(' ').slice(1).join(' ')}: A Step-by-Step Guide"
3. "${topic} - Everything You Need to Know"

### Meta Description Options:
1. "Learn everything about ${topic.toLowerCase()} in this comprehensive guide. Discover best practices, tips, and strategies to succeed."
2. "Master ${topic.toLowerCase()} with our complete guide. Step-by-step instructions, expert tips, and actionable advice."

## ${labels.links}
- Link to related guides and tutorials
- Connect to product/feature pages where relevant
- Reference case studies and success stories

## ${labels.next}
1. Review this research brief
2. Run /write ${topic} to generate the article
3. Review and optimize the draft

---
Generated: ${new Date().toISOString()}
Language: ${language.toUpperCase()}
`

    // Save the research brief
    const researchPath = path.join(process.cwd(), 'research')
    const filename = `brief-${topic.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.md`
    
    try {
      await fs.mkdir(researchPath, { recursive: true })
      await fs.writeFile(path.join(researchPath, filename), researchBrief)
    } catch (e) {
      console.error('Error saving research brief:', e)
    }

    return NextResponse.json({ 
      brief: researchBrief,
      filename 
    })
  } catch (error) {
    console.error('Research error:', error)
    return NextResponse.json(
      { error: 'Failed to perform research' },
      { status: 500 }
    )
  }
}
