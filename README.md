# avaliacoes-front — React + Auth0 (deploy na Vercel)

Front do simulado **Sistema de Avaliações**: login com Auth0, lista as avaliações e (só para ADMIN) cadastra.
A API fica no repositório `avaliacoes-api`; o passo a passo do Auth0 está no README de lá.

---

## 1. O que cada arquivo faz

```
avaliacoes-front/
├── src/
│   ├── config.js        ★ domain, clientId e audience do Auth0 (o ÚNICO lugar para trocar)
│   ├── main.jsx         envolve o app com o <Auth0Provider> (lê o config.js)
│   ├── App.jsx          não logado -> tela de login; logado -> cabeçalho + página
│   ├── useAuthToken.js  pega o token do Auth0 e lê email e roles de dentro dele
│   ├── api.js           ★ chamadas ao back (sempre com Authorization: Bearer <token>)
│   ├── Avaliacoes.jsx   ★ formulário (só ADMIN) + tabela
│   ├── PainelToken.jsx  mostra o token e o payload (para testar e para achar erros)
│   ├── LoginButton.jsx / LogoutButton.jsx
│   └── index.css        estilo
├── vite.config.js       local: /api -> http://localhost:8080
├── vercel.json          Vercel: /api -> http://IP_DA_VM:8080
└── package.json
```

★ = o que muda na prova.

### Por que as chamadas vão para `/api` e não direto para a VM?

A Vercel serve o site em **https**. A VM responde em **http**. O navegador **bloqueia** uma página https chamando um endereço http ("mixed content").

A solução do professor: o navegador chama `/api/avaliacoes` no **próprio site** (https), e quem repassa para a VM é o servidor:

```
LOCAL    navegador -> localhost:5173/api/avaliacoes -> (vite.config.js) -> localhost:8080/avaliacoes
VERCEL   navegador -> xxx.vercel.app/api/avaliacoes -> (vercel.json)    -> http://IP_DA_VM:8080/avaliacoes
```

Por isso o código só conhece `/api` (constante `API_URL` no `config.js`), e funciona igual nos dois lugares.

### Como o token chega no back

1. `loginWithRedirect()` manda para a tela do Auth0.
2. Depois do login, `getAccessTokenSilently()` devolve o **access token** (JWT) — pedido com o `audience` do `config.js`. Sem o audience o Auth0 devolve um token que o back não consegue validar.
3. `useAuthToken.js` abre a parte do meio do token (`atob`) e lê `https://social-insper.com/roles` e `.../email`. É assim que a tela sabe se mostra o formulário.
4. `api.js` manda o token em toda chamada: `Authorization: Bearer <token>`.

Esconder o formulário é só conforto. **Quem garante** que USER não cadastra é o back (403).

---

## 2. Rodar na sua máquina

Precisa do Node instalado (`node -v`). Na pasta do projeto:

```powershell
npm install      # só na primeira vez (cria a pasta node_modules)
npm run dev      # http://localhost:5173
```

O back tem que estar rodando na 8080 (`docker compose up -d` no `avaliacoes-api`).

Para testar o front local contra a API **da VM**: no `vite.config.js`, troque o `target` para `http://IP_DA_VM:8080` e rode `npm run dev` de novo.

---

## 3. Deploy na Vercel

1. No `vercel.json`, troque `IP_DA_VM` pelo IP público da VM
2. Suba o projeto para um repositório novo no GitHub (`avaliacoes-front`):

```powershell
git init
git add .
git commit -m "front avaliacoes"
git branch -M main
git remote add origin https://github.com/Vini8797/avaliacoes-front.git
git push -u origin main
```

3. **vercel.com** → entrar com o GitHub → **Add New → Project** → importar `avaliacoes-front`
4. Framework: **Vite** (detecta sozinho) → **Deploy**
5. Copie a URL (ex.: `https://avaliacoes-front.vercel.app`)
6. **No Auth0** (Applications → sua app → Settings), acrescente essa URL nos 3 campos, separada por vírgula:
   `http://localhost:5173, https://avaliacoes-front.vercel.app` → **Save Changes**

Cada `git push` na `main` faz a Vercel publicar de novo sozinha.

Se o IP da VM mudar: edite o `vercel.json` e dê push.

---

## 4. Na prova: adaptar

| O que mudou | Onde |
|---|---|
| a rota (`/avaliacoes` → `/feedbacks`) | `api.js` |
| os campos | `Avaliacoes.jsx`: `FORMULARIO_VAZIO`, os `<input>` do formulário, o objeto enviado em `criarAvaliacao(...)` e as colunas da tabela |
| quem vê o formulário | `Avaliacoes.jsx`: o `{isAdmin ? ... : ...}` |
| outro Auth0 | `config.js` |

Para um campo novo, por exemplo `cargo`:

```jsx
// 1. no FORMULARIO_VAZIO
const FORMULARIO_VAZIO = { emailAvaliado: "", comentarios: "", nota: "", cargo: "" };

// 2. um input dentro do <form> (o name tem que ser igual ao nome no objeto)
<label>
  Cargo
  <input name="cargo" value={form.cargo} onChange={alterarCampo} required />
</label>

// 3. no objeto enviado em enviar()
cargo: form.cargo,

// 4. uma coluna na tabela
<th>Cargo</th>   ...   <td>{a.cargo}</td>
```

---

## 5. Quando dá erro

| Sintoma | Causa → solução |
|---|---|
| Auth0: **Callback URL mismatch** | a URL do site não está nos 3 campos da Application no Auth0 |
| Tela branca | `F12` → Console. Quase sempre `config.js` com valor errado |
| "Erro 401: token ausente ou inválido" | `AUTH0_AUDIENCE` diferente do `audience` do back, ou domínio errado no back |
| "Erro 403: Apenas ADMIN..." logado como admin | role/Action no Auth0. Abra **Ver token**: precisa ter `"https://social-insper.com/roles": ["ADMIN"]`. Depois de mudar no Auth0, **Sair** e **Entrar** de novo |
| "Erro 500" local | o back não está rodando na 8080 |
| "Erro 502/504" na Vercel | a VM está fora, o IP do `vercel.json` está errado, ou a porta 8080 está fechada |
| Pede para "Authorize App" no login | normal no Auth0 com localhost: clique em **Accept** |
