# Envio de e-mail com anexos no Fluig

## Problema

Em muitas situações é necessário que os envolvidos em um determinados processo, recebam determinados anexos em suas caixas de entradas.
Quando o Fluig esta disponível para acesso externo, este problema pode ser facilmente resolvido enviando apenas o link público do arquivo atráves do método padrão de envios de e-mails, a função [notifier.notify](https://tdn.totvs.com/pages/releaseview.action?pageId=183730587#Personaliza%C3%A7%C3%A3odeemail-EnviodeE-mailPersonalizado).

No entanto, dependendo da regra de negócio, será obrigatório que os envolvido recebam o arquivo físico em seu e-mail, e não somente o link dele.

E aí nesta situação começam os problemas, pois não existe nenhuma configuração para a função notifier.notify que seja possível adicionar anexos. Com isso você deverá fazer o uso de APIs de terceiros. Ou então, como eu já fiz, desenvolver sua própria API utilizando alguma linguagem de programação onde seja possível realizar o envio de e-mail com anexos e consumir esta API dentro do Fluig.

## Solução

Com este dataset será possível realizar o envio de e-mail com anexos sem depender de serviços de terceiros, abaixo vou listar alguns vantagens e desvantagens em relação a função padrão notifier.notify.

### Vantagens

- É possível configurar um nome do remetente diferente para cada envio;
- É possível definir um e-mail para receber a resposta do destinatário;
- É possível enviar e-mails com cópias e/ou cópias ocultas;
- É possível enviar e-mails com vários anexos;
- É possível verificar se o e-mail foi enviado com sucesso.

### Desvantagens

- Não é possível utilizar os templates de e-mails do Fluig, neste caso terá que montar o corpo do e-mail na mão. _(Mais adiante irei mostrar como resolver isso com outro dataset)_;
- Obrigatório informar o e-mail e senha para autenticação. _(Neste caso poderá construir um outro dataset para obter as configurações do servidor de e-mail acessando diretamente no banco de dados do Fluig)_
- Não é possível utilizar a matrícula do usuário como destinatário, o dataset aceita apenas endereço de e-mails válidos.

## Configurações iniciais

Para que você consiga realizar o envio do e-mail através deste dataset, você deverá antes e tudo, informar as configurações do seu servidor de e-mail para autenticação, como usuário, senha, host, porta, etc.

Essas configurações fican logo no início da função _enviarEmail_. E caso seu servidor necessite de outras propriedades, basta procurar no google por _Java Mail Properties_, que irá encontrar vários links com toda a lista.

## Chamando o dataset

Para realizar o envio do e-mail com anexos, você deverá chamar o dataset passando as contraints. Algumas são obrigatórias e outras são opcionais, confira na lista abaixo:

| Constraint    | Descrição                                                                 | Valor Padrão                                                                                 | Obrigatório |
| ------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ----------- |
| nomeRemetente | Nome do remetente                                                         | ""                                                                                           | Sim         |
| assunto       | Assunto do e-mail                                                         | ""                                                                                           | Sim         |
| conteudo      | Corpo do e-mail escrito em HTML ou texto plano                            | ""                                                                                           | Sim         |
| destinatario  | E-mail do destinatário principal                                          | ""                                                                                           | Sim         |
| textoPlano    | Se verdadeiro, indica que o corpo do e-mail será enviado como texto plano | false                                                                                        | Não         |
| responderPara | E-mail que será configurado como ReplyTo                                  | Caso não informado assumirá como valor, o e-mail que foi configurado para realizar os envios | Não         |
| copia         | Array de string com os e-mails que serão enviados como cópia              | []                                                                                           | Não         |
| copiaOculta   | Array de string com os e-mails que serão enviados como cópias ocultas     | []                                                                                           | Não         |
| anexos        | Array de objetos com informações dos anexos a serem enviados no e-mail    | []                                                                                           | Não         |

### Constraint anexos

A constraint anexos receberá um array de objetos, onde cada objeto deverá conter as seguintes propriedades:

| Propriedade | Descrição                                              | Formato          | Obrigatório |
| ----------- | ------------------------------------------------------ | ---------------- | ----------- |
| id          | Id do arquivo                                          | Number ou String | Sim         |
| versao      | Versão do arquivo                                      | Number ou String | Sim         |
| nomeArquivo | Nome físico do arquivo                                 | String           | Sim         |
| descArquivo | Nome do arquivo com a extensão que aparecerá no e-mail | String           | Não         |

### Adicionando um anexo a partir de um base64

Para adicionar um arquivo que esteja em base64, o objeto deverá conter as seguintes propriedades:

| Propriedade  | Descrição                      | Formato | Obrigatório |
| ------------ | ------------------------------ | ------- | ----------- |
| stringBase64 | Base64 do arquivo              | String  | Sim         |
| nomeArquivo  | Nome do arquivo com a extensão | String  | Sim         |
| tipo         | Deve ser igual a "base64"      | String  | Sim         |

Na imagem abaixo esta um exemplo da chamada do dataset, lembrando que o array de cópia e cópia oculta, deverão ser informados nas constraints no formato string, dessa forma deverá utilizar _JSON.stringify()_.

![Exemplo](https://github.com/sergiomachadosilva/fluig-datasets/blob/master/dsEnviarEmailComAnexos/exemplo_01.png)

## Retorno em caso de sucesso

Caso não ocorra nenhum erro e o e-mail seja enviado com sucesso, o dataset irá retornar seguinte coluna e valor:

| STATUS |
| ------ |
| OK     |

## Retorno em caso de erro

| STATUS           |
| ---------------- |
| Mensagem do erro |

[Veja aqui o código completo do dataset](dsEnviarEmailComAnexos.js)

## Exemplos completos

Veja abaixo alguns exemplos de utilizanção deste dataset, onde fiz a chamada através de outro dataset

- [Chamando através de outro dataset](dsEnviarEmail.js)
- [Processo com rich editor](processo-exemplo01/)
- [Processo com rich editor, componente de anexos e tabela pai e filho](processo-exemplo02/)

### Créditos

**Este dataset foi criado a patir de uma solução disponibilizada pela comunidade [Fluiggers](https://fluiggers.com.br/t/envio-de-e-mail-com-anexos/545).**

- [Igor Rodrigues](https://www.linkedin.com/in/igorgoesrodrigues/)
- [Vinicius Silveira](https://www.linkedin.com/in/igorgoesrodrigues/)
