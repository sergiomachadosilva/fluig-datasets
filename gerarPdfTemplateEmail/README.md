# Gerando um arquivo PDF a partir de um template de e-mail no Fluig

Este dataset demonstra como é possível gerar um arquivo PDF a partir de um template de e-mail cadastrado no Fluig e salvá-lo em uma pasta específica no GED. Para este exemplo, utilizaremos o template "[templateTeste.html](https://github.com/sergiomachadosilva/fluig-datasets/blob/master/gerarPdfTemplateEmail/templateTeste.html)", que deverá ser cadastrado no Fluig acessando o menu "Painel de Controle => Templates de E-mails".

Caso tenha cadastrado um código diferente do apresentado abaixo ou selecionado outro idioma que não seja o português, é necessário alterar as variáveis correspondentes no dataset. Além disso, é importante informar o ID da pasta no GED onde o PDF será salvo.

![Cadastro](https://github.com/sergiomachadosilva/fluig-datasets/blob/master/gerarPdfTemplateEmail/print_cadastro_template.png)

## Resultado
Após cadastrar o template e informar as variáveis necessárias, execute o dataset. Ele deverá retornar o ID do documento criado no GED e o PDF gerado deverá ser exatamente como o apresentado abaixo:

![Imagem do PDF gerado](https://github.com/sergiomachadosilva/fluig-datasets/blob/master/gerarPdfTemplateEmail/Lista_de_Estados.jpg)


[Código do dataset](gerarPdfTemplateEmail.js)
