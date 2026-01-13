import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

// Language-specific labels for rewrite
const LANGUAGE_LABELS: Record<string, {
  updatedGuide: string,
  status: string,
  originalUrl: string,
  rewriteDate: string,
  focus: string,
  whatsNew: string,
  intro: string,
  currentState: string,
  keyStats: string,
  whatsChanged: string,
  updatedBest: string,
  newStrategies: string,
  questions: string,
  conclusion: string,
  summary: string,
  changes: string,
  seoImprovements: string,
  rewrittenBy: string
}> = {
  en: { updatedGuide: 'Updated Guide', status: 'Status', originalUrl: 'Original URL', rewriteDate: 'Rewrite Date', focus: 'Focus', whatsNew: "What's New in This Update", intro: 'Introduction', currentState: 'Current State of', keyStats: 'Key Statistics for', whatsChanged: "What's Changed", updatedBest: 'Updated Best Practices', newStrategies: 'New Strategies for', questions: 'Common Questions (Updated)', conclusion: 'Conclusion', summary: 'Rewrite Summary', changes: 'Changes Made', seoImprovements: 'SEO Improvements', rewrittenBy: 'Rewritten by SEO Content Guide on' },
  es: { updatedGuide: 'Guía Actualizada', status: 'Estado', originalUrl: 'URL Original', rewriteDate: 'Fecha de Reescritura', focus: 'Enfoque', whatsNew: 'Novedades en Esta Actualización', intro: 'Introducción', currentState: 'Estado Actual de', keyStats: 'Estadísticas Clave para', whatsChanged: 'Qué ha Cambiado', updatedBest: 'Mejores Prácticas Actualizadas', newStrategies: 'Nuevas Estrategias para', questions: 'Preguntas Comunes (Actualizadas)', conclusion: 'Conclusión', summary: 'Resumen de Reescritura', changes: 'Cambios Realizados', seoImprovements: 'Mejoras SEO', rewrittenBy: 'Reescrito por SEO Content Guide el' },
  fr: { updatedGuide: 'Guide Mis à Jour', status: 'Statut', originalUrl: 'URL Originale', rewriteDate: 'Date de Réécriture', focus: 'Focus', whatsNew: 'Nouveautés de Cette Mise à Jour', intro: 'Introduction', currentState: 'État Actuel de', keyStats: 'Statistiques Clés pour', whatsChanged: 'Ce Qui a Changé', updatedBest: 'Meilleures Pratiques Mises à Jour', newStrategies: 'Nouvelles Stratégies pour', questions: 'Questions Fréquentes (Mises à Jour)', conclusion: 'Conclusion', summary: 'Résumé de Réécriture', changes: 'Modifications Apportées', seoImprovements: 'Améliorations SEO', rewrittenBy: 'Réécrit par SEO Content Guide le' },
  de: { updatedGuide: 'Aktualisierter Leitfaden', status: 'Status', originalUrl: 'Original-URL', rewriteDate: 'Umschreibungsdatum', focus: 'Fokus', whatsNew: 'Neu in diesem Update', intro: 'Einleitung', currentState: 'Aktueller Stand von', keyStats: 'Wichtige Statistiken für', whatsChanged: 'Was sich geändert hat', updatedBest: 'Aktualisierte Best Practices', newStrategies: 'Neue Strategien für', questions: 'Häufige Fragen (Aktualisiert)', conclusion: 'Fazit', summary: 'Umschreibungsübersicht', changes: 'Vorgenommene Änderungen', seoImprovements: 'SEO-Verbesserungen', rewrittenBy: 'Umgeschrieben von SEO Content Guide am' },
  it: { updatedGuide: 'Guida Aggiornata', status: 'Stato', originalUrl: 'URL Originale', rewriteDate: 'Data Riscrittura', focus: 'Focus', whatsNew: 'Novità in Questo Aggiornamento', intro: 'Introduzione', currentState: 'Stato Attuale di', keyStats: 'Statistiche Chiave per', whatsChanged: 'Cosa è Cambiato', updatedBest: 'Best Practice Aggiornate', newStrategies: 'Nuove Strategie per', questions: 'Domande Comuni (Aggiornate)', conclusion: 'Conclusione', summary: 'Riepilogo Riscrittura', changes: 'Modifiche Apportate', seoImprovements: 'Miglioramenti SEO', rewrittenBy: 'Riscritto da SEO Content Guide il' },
  pt: { updatedGuide: 'Guia Atualizado', status: 'Status', originalUrl: 'URL Original', rewriteDate: 'Data de Reescrita', focus: 'Foco', whatsNew: 'Novidades Nesta Atualização', intro: 'Introdução', currentState: 'Estado Atual de', keyStats: 'Estatísticas Chave para', whatsChanged: 'O Que Mudou', updatedBest: 'Melhores Práticas Atualizadas', newStrategies: 'Novas Estratégias para', questions: 'Perguntas Comuns (Atualizadas)', conclusion: 'Conclusão', summary: 'Resumo da Reescrita', changes: 'Mudanças Feitas', seoImprovements: 'Melhorias SEO', rewrittenBy: 'Reescrito por SEO Content Guide em' },
  ja: { updatedGuide: '更新ガイド', status: 'ステータス', originalUrl: '元のURL', rewriteDate: '書き換え日', focus: 'フォーカス', whatsNew: 'このアップデートの新機能', intro: '導入', currentState: 'の現状', keyStats: 'の主要統計', whatsChanged: '変更点', updatedBest: '更新されたベストプラクティス', newStrategies: 'の新戦略', questions: 'よくある質問（更新版）', conclusion: '結論', summary: '書き換えサマリー', changes: '行われた変更', seoImprovements: 'SEO改善', rewrittenBy: 'SEO Content Guideにより書き換え' },
  zh: { updatedGuide: '更新指南', status: '状态', originalUrl: '原始URL', rewriteDate: '重写日期', focus: '重点', whatsNew: '此次更新的新内容', intro: '简介', currentState: '的当前状态', keyStats: '的关键统计数据', whatsChanged: '变化', updatedBest: '更新的最佳实践', newStrategies: '的新策略', questions: '常见问题（更新版）', conclusion: '结论', summary: '重写摘要', changes: '所做更改', seoImprovements: 'SEO改进', rewrittenBy: '由SEO Content Guide重写于' },
}

function getLangLabels(lang: string) {
  return LANGUAGE_LABELS[lang] || LANGUAGE_LABELS['en']
}

export async function POST(request: NextRequest) {
  try {
    const { url, topic, language = 'en' } = await request.json()
    
    if (!url && !topic) {
      return NextResponse.json({ error: 'URL or topic is required' }, { status: 400 })
    }

    const targetTopic = topic || 'Content Rewrite'
    const labels = getLangLabels(language)

    // Generate rewritten content
    const rewrittenContent = `# ${targetTopic}: ${labels.updatedGuide} [${new Date().getFullYear()}]

> **${labels.status}**: Rewritten and Updated
> **${labels.originalUrl}**: ${url || 'N/A'}
> **${labels.rewriteDate}**: ${new Date().toLocaleDateString()}
> **${labels.focus}**: SEO optimization, updated information, improved structure
> **Language**: ${language.toUpperCase()}

---

## ${labels.whatsNew}

This article has been comprehensively updated to include:

- ✅ Latest statistics and data for ${new Date().getFullYear()}
- ✅ Updated best practices and strategies
- ✅ Improved SEO optimization
- ✅ Enhanced structure and readability
- ✅ New sections covering recent developments
- ✅ Refreshed examples and case studies

---

## ${labels.intro}

[Your updated introduction here - hook the reader and explain what they'll learn]

${targetTopic} continues to evolve, and staying current with the latest approaches is essential for success. In this updated guide, we'll explore:

- The current state of ${targetTopic.toLowerCase()}
- Updated strategies that work in ${new Date().getFullYear()}
- New tools and techniques
- Expert insights and predictions

## ${labels.currentState} ${targetTopic}

[Update this section with current statistics and trends]

### ${labels.keyStats} ${new Date().getFullYear()}

- [Updated stat 1]
- [Updated stat 2]
- [Updated stat 3]
- [Updated stat 4]

### ${labels.whatsChanged}

The landscape has shifted in several important ways:

1. **[Change 1]** - [Explanation]
2. **[Change 2]** - [Explanation]
3. **[Change 3]** - [Explanation]

## ${labels.updatedBest}

Based on the latest research and expert recommendations:

### Practice 1: [Updated Practice Title]

[Explanation of why this practice is important now]

**Implementation steps:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

### Practice 2: [Updated Practice Title]

[Explanation with current context]

### Practice 3: [Updated Practice Title]

[Explanation with current context]

## ${labels.newStrategies} ${new Date().getFullYear()}

### Strategy 1: [New Strategy]

This emerging approach involves [explanation]. Early adopters are seeing [results].

### Strategy 2: [New Strategy]

[Explanation of the strategy and how to implement it]

### Strategy 3: [New Strategy]

[Explanation of the strategy and how to implement it]

## ${labels.questions}

### [Updated FAQ 1]?

[Current, accurate answer]

### [Updated FAQ 2]?

[Current, accurate answer]

### [Updated FAQ 3]?

[Current, accurate answer]

## ${labels.conclusion}

${targetTopic} remains a critical area to focus on. The strategies and insights shared in this updated guide reflect the current best practices and will help you [achieve desired outcome].

**Action items:**
- [ ] [First thing to do]
- [ ] [Second thing to do]
- [ ] [Third thing to do]

---

## ${labels.summary}

### ${labels.changes}
- Updated statistics and data
- Refreshed examples
- Added new sections
- Improved SEO optimization
- Enhanced readability
- Updated internal links

### ${labels.seoImprovements}
- [ ] Title tag optimized
- [ ] Meta description updated
- [ ] Heading structure improved
- [ ] Keyword density balanced
- [ ] Internal links added
- [ ] External links verified

---
*${labels.rewrittenBy} ${new Date().toLocaleDateString()}*
`

    // Save the rewrite
    const rewritesPath = path.join(process.cwd(), 'rewrites')
    const filename = `${targetTopic.toLowerCase().replace(/\s+/g, '-')}-rewrite-${new Date().toISOString().split('T')[0]}.md`
    
    try {
      await fs.mkdir(rewritesPath, { recursive: true })
      await fs.writeFile(path.join(rewritesPath, filename), rewrittenContent)
    } catch (e) {
      console.error('Error saving rewrite:', e)
    }

    return NextResponse.json({ 
      content: rewrittenContent,
      filename 
    })
  } catch (error) {
    console.error('Rewrite error:', error)
    return NextResponse.json(
      { error: 'Failed to rewrite content' },
      { status: 500 }
    )
  }
}
