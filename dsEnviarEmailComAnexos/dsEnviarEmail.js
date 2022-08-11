function createDataset(fields, constraints, sortFields) {

    var dataset = DatasetBuilder.newDataset();

    dataset.addColumn("STATUS");

    try {

        var constraints = [];
        var copia = [];
        var copiaOculta = [];
        var anexos = [];

        // Adiciona os e-mails que receberão uma cópia
        copia.push("emailcopia01@hotmail.com");
        copia.push("emailcopia01@hotmail.com");

        // Adiciona os e-mails que receberão uma cópia de forma oculta
        copiaOculta.push("emailcopiaoculta01@hotmail.com");
        copiaOculta.push("emailcopiaoculta01@hotmail.com");

        // Adiciona os anexos que serão enviados no e-mail
        anexos.push({ id: 2635, versao: 1000, nomeArquivo: "arquivo.pdf", descArquivo: "Meu Arquivo.pdf" });
        anexos.push({ id: 2649, versao: 1000, nomeArquivo: "image_01.png" });

        constraints.push(DatasetFactory.createConstraint("nomeRemetente", "Empresa XPTO", null, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint("assunto", "Envio de e-mail com anexos", null, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint("conteudo", "<h1 style='color:red'>Olá.!! Este é um teste de envio de e-mail com anexos no Fluig</h1>", null, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint("destinatario", "sergiojfjfjf@hotmail.com", null, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint("textoPlano", "true", null, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint("responderPara", "sergiojfjfjf@gmail.com", null, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint("copia", JSON.stringify(copia), null, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint("copiaOculta", JSON.stringify(copiaOculta), null, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint("anexos", JSON.stringify(anexos), null, ConstraintType.MUST));

        // Chama o dataset passando as constraints por parâmetro
        var dataset = DatasetFactory.getDataset("dsEnviarEmailComAnexos", null, constraints, null);

        var retorno = dataset.getValue(0, "STATUS");

        if (retorno != "OK") {
            throw retorno;
        }

        dataset.addRow(new Array("SUCESSO"));

    } catch (err) {
        dataset.addRow(new Array("dsEnviarEmail => function " + arguments.callee.name + " => " + err.toString()));
    }

    return dataset;
}

