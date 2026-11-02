# Meu Nutri — SistemaNutrição

Diário pessoal de alimentação e peso, em português, feito com HTML, CSS e JavaScript sem dependências externas.

## Como abrir no computador

1. Instale Python 3: https://www.python.org/downloads/.
2. Baixe este repositório pelo botão **Code → Download ZIP**, extraia e abra um terminal na pasta extraída.
3. Execute `python3 -m http.server 8000` (no Windows, use `py -m http.server 8000`).
4. Abra `http://localhost:8000` no navegador. Para encerrar, pressione Ctrl+C no terminal.

Não abra o HTML por duplo clique: os módulos JavaScript precisam do servidor HTTP.

## O que já funciona

- Seleção de data e registro de refeições com calorias informadas manualmente.
- Total diário, meta editável e percentual registrado. A meta inicial de 2.000 kcal é apenas um valor de exemplo, não uma recomendação.
- Registro de peso por data, atualização e exclusão de registros.
- Salvamento automático no navegador e exportação de backup JSON.
- Layout adaptado para celular e computador.

Os dados não são enviados ao GitHub ou a um servidor. Cada navegador e endereço tem seu próprio armazenamento. Limpar dados do navegador pode apagar os registros; exporte backups. Esta versão ainda não importa backups, sincroniza dispositivos, possui login ou calcula calorias por alimento. O JSON exportado pode ser lido em um editor de texto e contém seus dados pessoais; guarde-o com cuidado.

## Desenvolvimento e testes

Requer Node.js 20+ para testes e Python 3 para o servidor. Não é necessário instalar pacotes.

```sh
npm test
npm start
```

Teste manual: adicione uma refeição, confira o total, altere a data, registre um peso, recarregue e confira a persistência. Exclua um registro e exporte os dados. Os testes automatizados verificam soma por data, recuperação JSON, atualização do peso e rejeição de dados inválidos.

## Publicar como site no GitHub Pages

Após enviar o código para a branch `main`, abra **Settings → Pages** no repositório. Em **Build and deployment**, escolha **Deploy from a branch**, branch **main** e pasta **/ (root)**. Clique em **Save** e aguarde o GitHub informar o endereço. A disponibilidade depende do plano e da visibilidade do repositório. Nunca adicione exportações com seus registros pessoais ao repositório.

Este aplicativo serve para organização pessoal e não substitui acompanhamento nutricional.
