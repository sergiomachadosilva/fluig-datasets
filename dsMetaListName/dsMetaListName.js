function createDataset(fields, constraints, sortFields) {

    var dataset = DatasetBuilder.newDataset();

    //Cria as colunas
    dataset.addColumn("CODIGO");
    dataset.addColumn("TABELA");

    try {

        var cardIndexId = obterParametro(constraints, "CODIGO"); //Id do formulário
        if (cardIndexId == "") {
            throw "Id do formulário não informado";
        }

        var companyId = java.lang.Integer(fluigAPI.getSecurityService().getCurrentTenantId());
        var metaListId = java.lang.Integer(getMetaListId(companyId, cardIndexId));

        var codigoEmpresa = java.lang.String.format("%03d", companyId);
        var codigoMetaListId = java.lang.String.format("%03d", metaListId);

        var tabela = "ML" + codigoEmpresa + codigoMetaListId;

        dataset.addRow(new Array(cardIndexId, tabela));

    } catch (err) {
        dataset = DatasetBuilder.newDataset();
        dataset.addColumn("CODIGO");
        dataset.addColumn("ERROR");
        dataset.addRow(new Array(null, err.toString()));
    }

    return dataset;
}


/**
 * Obtém a metaListId com base no id do formulário e id da empresa
 * @param {Number} companyId Parâmetro obrigatório, id da empresa
 * @param {Number|String} cardIndexId Parâmetro obrigatório, id do formulário
 * @returns {Number} Retorna a metaListId do formulário
 * @author Sérgio Machado
 */
function getMetaListId(companyId, cardIndexId) {
    var c1 = DatasetFactory.createConstraint("documentPK.companyId", companyId, companyId, ConstraintType.MUST);
    var c2 = DatasetFactory.createConstraint("documentPK.documentId", cardIndexId, cardIndexId, ConstraintType.MUST);
    var c3 = DatasetFactory.createConstraint("activeVersion", true, true, ConstraintType.MUST);
    var dataset = DatasetFactory.getDataset("document", null, new Array(c1, c2, c3), null);

    if (dataset.getRowsCount() > 0) {
        return String(dataset.getValue(0, "metaListId"));
    }

    return 0;
}


/**
 * Retorna o valor initialValue de uma determinada constraint
 * @param {object} constraints Parâmetro obrigatório, constraints recebidas no dataset
 * @param {String} campo Parâmetro obrigatório, constraint que deseja obter o valor
 * @return {String} 
 */
function obterParametro(constraints, campo) {
    var valor = 0;
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