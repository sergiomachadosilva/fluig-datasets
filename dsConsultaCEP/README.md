# Retorna informações de endereço com base no CEP.

Para utilizar este dataset primeiro terá que cadastrar o serviço no Fluig, em Paninel de Controle > Serviços.
Clique o botão "Novo serviço" na tela seguinte no campo Serviço, selecione a opção REST. E informe os dados conforme abaixo:

| Campo                     | Valor                                                           | Obrigatório |
| ------------------------- | --------------------------------------------------------------- | ----------- |
| Nome                      | wsViaCEP                                                        | Sim         |
| Descrição                 | Webservice para consultar Códigos de Endereçamento Postal (CEP) | Sim         |
| Domínio                   | https://viacep.com.br                                           | Sim         |
| Tipo de Autenticação      | None                                                            | Sim         |
| URL para teste de Serviço | /ws/70150900/json/                                              | Opcional    |

[Veja aqui o código do dataset](dsConsultaCEP.js)
