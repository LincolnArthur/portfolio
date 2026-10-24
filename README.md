# portfolio

Meu site pessoal: apresentação, projetos, currículo digital e formulário de contato.

**https://arthurlincoln.netlify.app**

Feito em HTML, CSS e JavaScript puro, sem framework, e hospedado no Netlify. Cada `git push` neste repositório publica o site de novo.

O visual segue o modelo do meu currículo: barra lateral azul (#0B5394), títulos em Verdana com sublinhado grosso e texto em Palatino. As fontes são as do próprio sistema de quem visita, então o site não baixa nenhuma fonte.

## Páginas

| Endereço | Página |
|---|---|
| `/` | Início: o labirinto do Projeto 1 de AED resolvido por BFS ao vivo, os projetos e o formulário de contato |
| `/curriculo/` | Currículo digital no mesmo formato do modelo em Word, com download em PDF e .docx (português e inglês) |
| `/obrigado/` | Confirmação depois de enviar o formulário |
| `/privacidade/` | Política de privacidade (LGPD) |
| `/404.html` | Página de erro para endereços que não existem |

Todas as páginas têm versão em português e em inglês (opção "Português | English" na barra azul).

## Como editar

- **Contatos (e-mail, telefone, LinkedIn, Instagram, X):** no começo de `assets/site.js`, preencha o objeto `LINKS`. Campo vazio não aparece no site. O telefone vira um link de WhatsApp.
- **Cores, fontes e layout:** `assets/site.css`.
- **Textos:** o português está direto no HTML de cada página. O inglês fica no `window.PAGE_EN`, no fim de cada página (e no `EN_COMMON` do `site.js`, para o cabeçalho e o rodapé).
- **Currículo:** o original fica em `assets/cv/` (`arthur-lincoln-curriculo.docx` em português e `arthur-lincoln-resume.docx` em inglês). Se mudar algo, edite o .docx no Word ou no LibreOffice, exporte de novo como PDF com o mesmo nome e atualize o texto da página `curriculo/index.html`.

Para ver o site no computador antes de enviar:

```bash
python3 -m http.server
```

Depois, abra http://localhost:8000.

## Serviços usados

- **Netlify:** hospedagem e recebimento do formulário de contato. As mensagens aparecem no painel do Netlify e chegam por e-mail.
- **GoatCounter:** estatísticas de visitas, sem cookies. Por isso o site não precisa de aviso de cookies.

