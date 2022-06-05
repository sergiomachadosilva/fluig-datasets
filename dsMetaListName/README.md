# Retorna nome da tabela do formulário no banco de dados

Este dataset tem como objetivo retornar o nome da tabela no banco de dados de um formulário.

_Um formulário configurado para armazenar seus dados em tabelas múltiplas, quando exportado criará uma nova tabela no banco de dados cujo nome seguirá o padrão MLEEELLL, onde EEE representa o código da empresa precedido por zeros e LLL representa o código da lista (gerado de forma sequencial pela plataforma) também precedido por zeros._

![Esquema](https://github.com/sergiomachadosilva/fluig-datasets/blob/master/dsMetaListName/esquema.png)

Para mais detalhes acesse a documentação: [Modelos de Armazenamento de Formulários](https://tdn.totvs.com/pages/releaseview.action?pageId=244716710)

## Chamando o dataset em um arquivo js do formulário

Vale ressaltar que por se tratar de um dataset, você tem a liberdade para chamar em qualquer lugar, como js do formulário, eventos de processo, eventos de formulário, outros datasets, etc.

| Constraint | Valor | Obrigatório |
| ---------- | ----- | ----------- |
| CODIGO     | 3765  | Sim         |

A constraint CODIGO, corresponde ao id do formulário, cuidado para não confundir com o id de registro do formulário.

```js
const cCodigo = DatasetFactory.createConstraint(
  "CODIGO",
  "3765",
  null,
  ConstraintType.MUST
);

//Busca dados do dataset
const dataset = DatasetFactory.getDataset(
  "dsMetaListName",
  null,
  [cCodigo],
  null
);
const data = dataset.values;
if (!data[0].ERROR) {
  console.log(data[0].TABELA); // Imprime no console o nome da tabela
} else {
  console.error(data[0].ERROR);
}
```

## Retorno em caso de sucesso

Caso não ocorra nenhum erro o dataset irá retornar as seguinte colunas:

| CODIGO | TABELA   |
| ------ | -------- |
| 3765   | ML001004 |

## Retorno em caso de erro

| CODIGO | ERROR                          |
| ------ | ------------------------------ |
| null   | Id do formulário não informado |

[Veja aqui o código do dataset](dsMetaListName.js)
