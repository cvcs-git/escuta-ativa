# Escuta Ativa

Aplicativo web de letramento digital para pessoas com 60 anos ou mais. Por voz e em linguagem simples, ele ensina tarefas do dia a dia no celular e ajuda a identificar mensagens de golpe.

Projeto desenvolvido no módulo **RiseUp 2026.2**, da Residência em Software e IA do **Porto Digital**, no curso de Análise e Desenvolvimento de Sistemas da **Faculdade Senac Pernambuco**.

**Demonstração:** [escuta-ativa-eta.vercel.app](https://escuta-ativa-eta.vercel.app/)

## O problema

Pessoas com 60 anos ou mais enfrentam barreiras no uso do smartphone, como dificuldades motoras e cognitivas, insegurança e exposição a golpes. Isso limita a autonomia em tarefas como comunicação, pagamentos e acesso a serviços.

A equipe entrevistou cinco pessoas de 61 a 89 anos. Todas relataram ao menos uma tentativa de golpe por ligação ou WhatsApp, e uma delas perdeu R$ 6.000,00 ao clicar em um link falso. Três preferiam falar a digitar, e três relataram dificuldades de memória e concentração. Essas respostas definiram as três funções do aplicativo.

## Funcionalidades

**Perguntar falando.** A pessoa faz a pergunta em voz alta, confere o texto que o aplicativo entendeu e recebe a resposta em até cinco passos curtos, mostrados um por vez e lidos em voz. Cada passo pode trazer uma ilustração da tela do celular, com um dedo indicando onde tocar. Se não encontrar um botão no próprio aparelho, a pessoa pode pedir outra explicação para aquele passo.

**Isso é golpe?** A pessoa cola ou dita uma mensagem recebida, e o aplicativo a classifica como provável golpe, suspeita ou sem sinais de golpe, sempre com o motivo e uma orientação prática. Antes de qualquer envio, o aplicativo detecta senhas e códigos na mensagem, bloqueia o envio e alerta o usuário.

**Lições.** São tutoriais curtos, como fazer um Pix com segurança ou mandar uma foto pelo WhatsApp. Cada passo traz uma ilustração da tela do celular, com um dedo e um círculo pulsando sobre o ponto onde tocar. O conteúdo foi revisado pela equipe e continua funcionando sem internet.

**Ajustes.** A pessoa escolhe o tamanho da letra, liga ou desliga a leitura em voz e ajusta a velocidade da fala. Os ajustes ficam salvos só no aparelho, sem cadastro e sem senha.

## Uso de inteligência artificial

O modelo de linguagem atende duas tarefas, a resposta passo a passo e a classificação de golpes. Ele sempre devolve JSON em formato fixo, e o aplicativo decide como exibir cada campo. Essa separação garante quatro coisas:

- **Formato validado:** respostas fora do formato, com mais de cinco passos ou com frases longas são descartadas.
- **Rótulos controlados pelo app:** o título, a cor e o ícone do resultado de golpe vêm do aplicativo, e não da IA. Por isso, uma mensagem nunca é apresentada como "segura".
- **Ilustrações sem imagens geradas:** a IA não desenha. Para cada passo, ela escolhe um de 13 modelos de tela (aplicativos, lista de opções, menu, chave liga/desliga, barra, botões, campo, gesto, conversa, chamada, câmera, teclado e botões do aparelho) e preenche os textos. O app valida a descrição, inclusive se o elemento apontado pelo dedo é o mesmo citado no texto do passo, e desenha com as mesmas peças das lições. Na dúvida, o passo aparece só com o texto.
- **Serviço trocável:** o serviço de IA segue uma interface única (`ServicoIA`). A versão simulada e a versão com o Gemini podem ser trocadas sem alterar as telas.

As lições não usam IA, o que reduz o risco de instruções incorretas nos conteúdos de aprendizagem.

## Acessibilidade

- Alvos de toque de no mínimo 88 px (cerca de 14 mm), conforme estudos com pessoas acima de 65 anos.
- Letra base de 20 px, ajustável para 23 px ou 26 px.
- Fonte [Atkinson Hyperlegible Next](https://www.brailleinstitute.org/freefont/), desenvolvida pelo Braille Institute para pessoas com baixa visão.
- Contraste mínimo de 4,5:1 e ícones sempre acompanhados de texto.
- Navegação com no máximo dois níveis e botão "Voltar" escrito por extenso.
- Leitura em voz de todas as respostas e confirmação do texto falado antes do envio.
- Destaque palavra por palavra do trecho que está sendo lido, para que pessoas com pouca familiaridade com a leitura acompanhem o áudio com os olhos. O botão cujo nome é falado ganha um contorno.
- Ilustrações de tela em cada passo das lições, indicando onde tocar.
- Botões com sombra que "afundam" ao toque, confirmando visualmente a ação.
- Linguagem simples, sem termos em inglês.
- Respeito à preferência do sistema por menos animação.

## Tratamento de falhas

| Situação                                 | Comportamento                                     |
| ---------------------------------------- | ------------------------------------------------- |
| Resposta demorada                        | Aviso "Estou pensando..." após 5 s                |
| Sem resposta                             | Encerramento em 10 s, com opção de tentar de novo |
| Serviço indisponível                     | Nova tentativa automática após 2 s                |
| Limite de requisições (429)              | Aviso de pausa, sem nova tentativa                |
| Resposta fora do formato                 | Descarte e mensagem de erro                       |
| Sem internet                             | Aviso na tela; as lições continuam disponíveis    |
| Microfone bloqueado ou sem suporte a voz | Opção de escrever a pergunta                      |

Os estados de erro podem ser reproduzidos acrescentando `?simular=lento`, `timeout`, `indisponivel`, `formato` ou `limite` ao endereço das telas `#/perguntar` e `#/golpe`.

## Tecnologias

- **React 19 + TypeScript**, com build pelo **Vite**
- **React Router**, com rotas por hash
- **Web Speech API** para reconhecimento de fala e leitura em voz
- **Firebase AI Logic + Gemini** como serviço de IA, com versão simulada para desenvolvimento e demonstração
- **Vitest** para testes automatizados, **ESLint** e **Prettier** para padronização do código
- **CSS** com design system próprio, sem bibliotecas de componentes
- **Vercel** para publicação

## Arquitetura

O código é organizado **por funcionalidade**: cada tela tem sua pasta com a página, a lógica, os componentes e os estilos. O que é usado por várias telas fica em `compartilhado/`, e o acesso a recursos externos (IA, voz do navegador) fica em `servicos/`.

```
src/
├── app/                 montagem do app: provedores, rotas e tratamento de erros inesperados
├── funcionalidades/
│   ├── inicio/          T2 Início: ondas sonoras e cartões de vidro
│   ├── boas-vindas/     T1 primeiro acesso: letra e leitura em voz
│   ├── assistente/      T3 Perguntar: máquina de estados, hook e componentes de cada etapa
│   ├── golpe/           T6 Isso é golpe?: máquina de estados, níveis de alerta e resultado
│   ├── licoes/          T4 e T5: conteúdo (JSON), lista, lição e ilustrações de cada passo
│   └── ajustes/         T7: letra, leitura em voz, velocidade e escolha da voz
├── compartilhado/
│   ├── componentes/     Botão, Tela, PassoAPasso, TextoLido, Ondas, EstadoErro, ícones...
│   ├── ilustracoes/     peças de desenho e os 13 modelos de tela usados nas respostas do assistente
│   ├── preferencias/    ajustes do usuário, guardados só no aparelho
│   ├── hooks/           estado da conexão
│   └── utilitarios/     funções puras de texto
├── servicos/
│   ├── ia/              contrato, validação das respostas e das ilustrações, regras de chamada e serviço simulado
│   ├── voz/             leitura em voz com destaque, escolha da voz e reconhecimento de fala
│   └── seguranca/       detecção de senhas e códigos antes do envio
├── estilos/             tokens (cores e medidas), base, layout e componentes básicos
└── tipos/               tipos da API de reconhecimento de fala do navegador
```

**Decisões principais**

- **Lógica separada da tela.** As telas com fluxo (Perguntar e Isso é golpe?) usam uma máquina de estados em função pura (`maquinaDoAssistente.ts`, `maquinaDoGolpe.ts`), testada isoladamente. Um hook (`useAssistente`, `useVerificacaoGolpe`) liga a máquina ao microfone, à IA e à voz, e a página só desenha a etapa atual.
- **Contrato único para a IA.** As telas dependem apenas da interface `ServicoIA`. O serviço simulado e o Gemini são intercambiáveis em um único ponto (`servicos/ia/index.ts`).
- **Estilos ao lado de quem os usa.** Tokens e base são globais; cada tela e cada componente importa o próprio CSS.
- **Sem carregamento sob demanda das telas**, de propósito: depois do primeiro acesso, o app inteiro está no aparelho, e as lições abrem mesmo sem internet.
- **Testes ao lado do código** (`*.test.ts`): validação das respostas e das ilustrações da IA, respostas simuladas, máquinas de estados, detecção de senhas, escolha de voz e utilitários.

## Como executar

```bash
npm install
npm run dev      # servidor de desenvolvimento
npm run check    # tipos, regras de código (ESLint) e testes
npm run build    # versão de produção em dist/
```

O reconhecimento de fala exige `localhost` ou HTTPS.

## Equipe

- Carlos Vinícius Costa da Silva
- Fabian Gomes Souza
- João Apuã de Melo
- Luíza Vieira Cavalcanti

Recife, 2026.
