"use strict";(()=>{var e={};e.id=136,e.ids=[136],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},2048:e=>{e.exports=require("fs")},5315:e=>{e.exports=require("path")},4248:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>v,patchFetch:()=>y,requestAsyncStorage:()=>h,routeModule:()=>m,serverHooks:()=>g,staticGenerationAsyncStorage:()=>w});var s={};r.r(s),r.d(s,{POST:()=>l});var i=r(9303),o=r(8716),n=r(670),a=r(7070),c=r(2048),d=r(5315),u=r.n(d);let p={en:{research:"Research Brief",keywords:"Keywords",overview:"Topic Overview",analysis:"Competitor Analysis",intent:"Search Intent",structure:"Recommended Content Structure",meta:"Meta Elements Suggestions",links:"Internal Linking Opportunities",next:"Next Steps"},es:{research:"Informe de Investigaci\xf3n",keywords:"Palabras Clave",overview:"Resumen del Tema",analysis:"An\xe1lisis de Competidores",intent:"Intenci\xf3n de B\xfasqueda",structure:"Estructura de Contenido Recomendada",meta:"Sugerencias de Meta Elementos",links:"Oportunidades de Enlaces Internos",next:"Pr\xf3ximos Pasos"},fr:{research:"Rapport de Recherche",keywords:"Mots-cl\xe9s",overview:"Aper\xe7u du Sujet",analysis:"Analyse Concurrentielle",intent:"Intention de Recherche",structure:"Structure de Contenu Recommand\xe9e",meta:"Suggestions de M\xe9ta \xc9l\xe9ments",links:"Opportunit\xe9s de Liens Internes",next:"Prochaines \xc9tapes"},de:{research:"Forschungsbericht",keywords:"Schl\xfcsselw\xf6rter",overview:"Themen\xfcbersicht",analysis:"Wettbewerbsanalyse",intent:"Suchintention",structure:"Empfohlene Inhaltsstruktur",meta:"Meta-Element-Vorschl\xe4ge",links:"Interne Verlinkungsm\xf6glichkeiten",next:"N\xe4chste Schritte"},it:{research:"Rapporto di Ricerca",keywords:"Parole Chiave",overview:"Panoramica Argomento",analysis:"Analisi Competitor",intent:"Intento di Ricerca",structure:"Struttura Contenuti Consigliata",meta:"Suggerimenti Meta Elementi",links:"Opportunit\xe0 Link Interni",next:"Prossimi Passi"},pt:{research:"Relat\xf3rio de Pesquisa",keywords:"Palavras-chave",overview:"Vis\xe3o Geral do T\xf3pico",analysis:"An\xe1lise de Concorrentes",intent:"Inten\xe7\xe3o de Busca",structure:"Estrutura de Conte\xfado Recomendada",meta:"Sugest\xf5es de Meta Elementos",links:"Oportunidades de Links Internos",next:"Pr\xf3ximos Passos"}};async function l(e){try{let{topic:t,language:r="en"}=await e.json();if(!t)return a.NextResponse.json({error:"Topic is required"},{status:400});let s=p[r]||p.en,i=u().join(process.cwd(),"context");try{await c.promises.readFile(u().join(i,"brand-voice.md"),"utf-8")}catch{}try{await c.promises.readFile(u().join(i,"features.md"),"utf-8")}catch{}let o=`# ${s.research}: ${t}

## ${s.overview}
Research topic: "${t}"
Language: ${r.toUpperCase()}

## Primary ${s.keywords}
- ${t.toLowerCase()}
- ${t.toLowerCase().split(" ").slice(0,2).join(" ")} guide
- how to ${t.toLowerCase().split(" ").slice(0,3).join(" ")}
- best ${t.toLowerCase().split(" ").slice(0,2).join(" ")}
- ${t.toLowerCase()} tips

## Secondary ${s.keywords}
- ${t.toLowerCase()} strategies
- ${t.toLowerCase()} best practices
- ${t.toLowerCase()} for beginners
- complete guide to ${t.toLowerCase()}
- ${t.toLowerCase()} examples

## ${s.analysis}
### Top-Ranking Content Characteristics
- Average word count: 2,500-3,500 words
- Common structure: Introduction, Core sections, How-to steps, FAQ
- Media usage: Images, infographics, examples

### Content Gaps to Fill
- Provide more actionable, step-by-step guidance
- Include real-world examples and case studies
- Add expert insights and data-backed claims
- Cover advanced strategies competitors miss

## ${s.intent}
**Primary Intent**: Informational
Users searching for this topic typically want to:
- Learn how something works
- Get step-by-step guidance
- Understand best practices
- Make informed decisions

## ${s.structure}

### H1: [Main Title - Include Primary Keyword]

### H2 Sections:
1. **Introduction** - Hook + what they'll learn
2. **What is ${t}?** - Definition and overview
3. **Why ${t} Matters** - Benefits and importance
4. **How to Get Started with ${t}** - Step-by-step guide
5. **Best Practices for ${t}** - Expert tips
6. **Common Mistakes to Avoid** - What not to do
7. **Advanced Strategies** - Next-level tactics
8. **Tools and Resources** - Helpful tools
9. **FAQ** - Common questions answered
10. **Conclusion** - Summary + CTA

## ${s.meta}

### Title Options:
1. "${t}: The Complete Guide [${new Date().getFullYear()}]"
2. "How to ${t.split(" ")[0]} ${t.split(" ").slice(1).join(" ")}: A Step-by-Step Guide"
3. "${t} - Everything You Need to Know"

### Meta Description Options:
1. "Learn everything about ${t.toLowerCase()} in this comprehensive guide. Discover best practices, tips, and strategies to succeed."
2. "Master ${t.toLowerCase()} with our complete guide. Step-by-step instructions, expert tips, and actionable advice."

## ${s.links}
- Link to related guides and tutorials
- Connect to product/feature pages where relevant
- Reference case studies and success stories

## ${s.next}
1. Review this research brief
2. Run /write ${t} to generate the article
3. Review and optimize the draft

---
Generated: ${new Date().toISOString()}
Language: ${r.toUpperCase()}
`,n=u().join(process.cwd(),"research"),d=`brief-${t.toLowerCase().replace(/\s+/g,"-")}-${new Date().toISOString().split("T")[0]}.md`;try{await c.promises.mkdir(n,{recursive:!0}),await c.promises.writeFile(u().join(n,d),o)}catch(e){console.error("Error saving research brief:",e)}return a.NextResponse.json({brief:o,filename:d})}catch(e){return console.error("Research error:",e),a.NextResponse.json({error:"Failed to perform research"},{status:500})}}let m=new i.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/research/route",pathname:"/api/research",filename:"route",bundlePath:"app/api/research/route"},resolvedPagePath:"C:\\Users\\haile\\coding\\Marketing-Products\\seomachine\\seomachine\\app\\api\\research\\route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:h,staticGenerationAsyncStorage:w,serverHooks:g}=m,v="/api/research/route";function y(){return(0,n.patchFetch)({serverHooks:g,staticGenerationAsyncStorage:w})}}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[276,972],()=>r(4248));module.exports=s})();