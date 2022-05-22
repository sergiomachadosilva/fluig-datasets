function createDataset(fields, constraints, sortFields) {

    var dataset = DatasetBuilder.newDataset();

    //Cria as colunas
    dataset.addColumn("CEP");
    dataset.addColumn("ENDERECO");
    dataset.addColumn("COMPLEMENTO");
    dataset.addColumn("BAIRRO");
    dataset.addColumn("CIDADE");
    dataset.addColumn("ESTADO");
    dataset.addColumn("DDD");
    dataset.addColumn("IBGE");
    dataset.addColumn("SIAFI");

    try {

        var cepStr = new java.lang.String(obterParametro(constraints, "CEP"));
        if (cepStr == "") {
            throw "CEP não informado";
        }

        // Remove tudo o que não for número
        var CEP = cepStr.replaceAll("[^\\d]", "");

        var clientService = fluigAPI.getAuthorizeClientService();
        var data = {
            companyId: String(fluigAPI.getSecurityService().getCurrentTenantId()),
            serviceCode: 'wsViaCEP',
            endpoint: '/ws/' + CEP + '/json/',
            method: 'get',
            timeoutService: '100'
        }

        try {

            var vo = clientService.invoke(JSON.stringify(data));
            var retorno = JSON.parse(vo.getResult());

            if (!retorno.erro) {
                dataset.addRow(new Array(
                    CEP,
                    retorno.logradouro,
                    retorno.complemento,
                    retorno.bairro,
                    retorno.localidade,
                    retorno.uf,
                    retorno.ddd,
                    retorno.ibge,
                    retorno.siafi
                ));
            } else {
                throw "CEP não encontrado";
            }

        } catch (e) {
            throw "CEP não encontrado";
        }

    } catch (err) {
        dataset = DatasetBuilder.newDataset();
        dataset.addColumn("ERROR");
        dataset.addRow(new Array(err.toString()));
    }

    return dataset;
}


/**
 * Retorna o valor initialValue de uma determinada constraint
 * @param {object} constraints Parâmetro obrigatório, constraints recebidas no dataset
 * @param {String} campo Parâmetro obrigatório, constraint que deseja obter o valor
 * @return {String} 
 */
function obterParametro(constraints, campo) {
    var valor = "";
    if ((constraints != null) && (constraints.length > 0)) {
        for (i in constraints) {
            var constraint = constraints[i]
            if (constraint.getFieldName().trim().toUpperCase() == campo.trim().toUpperCase()) {
                valor = constraint.getInitialValue();
                break;
            }
        }
    }
    return valor;
}