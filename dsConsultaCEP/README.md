# Retorna informações de endereço com base no CEP.

Para utilizar este dataset primeiro terá que cadastrar o serviço no Fluig, em Paninel de Controle > Serviços.
Clique o botão "Novo serviço" na tela seguinte no campo Serviço, selecione a opção REST. E informe os dados conforme abaixo:

## Cadastro

| Campo                     | Valor                                                           | Obrigatório |
| ------------------------- | --------------------------------------------------------------- | ----------- |
| Nome                      | wsViaCEP                                                        | Sim         |
| Descrição                 | Webservice para consultar Códigos de Endereçamento Postal (CEP) | Sim         |
| Domínio                   | https://viacep.com.br                                           | Sim         |
| Tipo de Autenticação      | None                                                            | Sim         |
| URL para teste de Serviço | /ws/70150900/json/                                              | Opcional    |

## Imagem

![Tela Serviço](https://github.com/sergiomachadosilva/fluig-datasets/blob/master/dsConsultaCEP/tela_servico.png)

## Chamando o dataset em um arquivo js do formulário

| Constraint | Valor    | Obrigatório |
| ---------- | -------- | ----------- |
| CEP        | 70150900 | Sim         |

_Você está livre para informar o valor do CEP formatado ou não, o dataset se encarregará de remover tudo o que não for número._

```
const cCep = DatasetFactory.createConstraint("CEP", "70150900", null, ConstraintType.MUST);

//Busca dados do dataset
const dataset = DatasetFactory.getDataset("dsConsultaCEP", null, [cCep], null);
const data = dataset.values;
if (!data[0].ERROR) {
  console.log(dataset);
} else {
  console.error(data[0].ERROR);
}
```

## Retorno em caso de sucesso

Caso seu cep seja encontrado, o dataset irá retornar as seguinte colunas:

| CEP      | ENDERECO               | COMPLEMENTO | BAIRRO                     | CIDADE   | ESTADO | DDD | IBGE    | SIAFI |
| -------- | ---------------------- | ----------- | -------------------------- | -------- | ------ | --- | ------- | ----- |
| 70150900 | Praça dos Três Poderes |             | Zona Cívico-Administrativa | Brasília | DF     | 61  | 5300108 | 9701  |

## Retorno em caso de erro

| ERROR              |
| ------------------ |
| CEP não encontrado |

[Veja aqui o código do dataset](dsConsultaCEP.js)
